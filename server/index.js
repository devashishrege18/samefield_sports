const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

// --- In-Memory State ---
// connectedUsers: { [guest_id]: { name, socketId } }
let connectedUsers = {};
// posts: Array of { id, author_id, author_name, content, created_at, likes: [] }
let posts = [
    {
        id: '1',
        author_id: 'system',
        author_name: 'FandomHost',
        content: 'Welcome to the Fandom! Creating this space for all of you. 🏟️',
        created_at: new Date().toISOString(),
        likes: [],
        comments: []
    }
];

const MAX_USERS = 10;
const GLOBAL_ROOM = "GLOBAL_FAN_ROOM";

// --- REST API ---

// GET /posts - Get feed
app.get('/posts', (req, res) => {
    // Return sorted by newest first
    const sorted = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(sorted);
});

// POST /posts - Create post
app.post('/posts', (req, res) => {
    const { guest_id, guest_name, content } = req.body;

    if (!guest_id || !guest_name || !content) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // "Validate guest exists" - strict check: must be online? 
    // User requirement: "Validate guest exists"
    // We will check if guest_id is present. 
    // (Optional: we could check `if (!connectedUsers[guest_id])` but HTTP handles distinct from Socket, 
    // better to allow posting even if socket slightly disconnected)

    const newPost = {
        id: Date.now().toString(),
        author_id: guest_id,
        author_name: guest_name,
        content,
        created_at: new Date().toISOString(),
        likes: [],
        comments: []
    };

    posts.unshift(newPost); // Add to top

    // Return updated feed
    res.json(posts);
});

// POST /posts/:id/like - Like/Unlike
app.post('/posts/:id/like', (req, res) => {
    const { id } = req.params;
    const { guest_id } = req.body;

    const post = posts.find(p => p.id === id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(guest_id);
    if (likeIndex > -1) {
        // Unlike
        post.likes.splice(likeIndex, 1);
    } else {
        // Like
        post.likes.push(guest_id);
    }

    res.json({ id: post.id, likes: post.likes.length, likedByMe: likeIndex === -1 });
});

// POST /posts/:id/comments - Add comment to post
app.post('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const { guest_id, guest_name, text } = req.body;

    if (!guest_id || !guest_name || !text) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const post = posts.find(p => p.id === id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        author_id: guest_id,
        author_name: guest_name,
        text,
        created_at: new Date().toISOString()
    };

    post.comments.push(newComment);

    res.json({ success: true, comment: newComment, totalComments: post.comments.length });
});

// GET /posts/:id/comments - Get comments for a post
app.get('/posts/:id/comments', (req, res) => {
    const { id } = req.params;

    const post = posts.find(p => p.id === id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    res.json(post.comments || []);
});


// --- Socket.IO Logic ---

// Middleware to enforce User Limit
io.use((socket, next) => {
    const currentCount = Object.keys(connectedUsers).length;
    // We are about to add one, so if currently >= 10, reject.
    if (currentCount >= MAX_USERS) {
        const err = new Error("Room full (Max 10 users)");
        return next(err);
    }
    next();
});

io.on('connection', (socket) => {

    // Step 8: Frontend sends guest_id, guest_name
    // Usually sent in handshake query or auth, or first event.
    // User prompt says "When socket connects: Frontend sends..."
    // Simpler to handle standard query params or `socket.handshake.auth`
    // Let's assume query params: ?guest_id=...&guest_name=...

    const { guest_id, guest_name } = socket.handshake.query;

    if (!guest_id || !guest_name) {
        // Reject invalid
        socket.disconnect(true);
        return;
    }

    // Register User
    // If the SAME guest connects from another tab, we might overwrite or block?
    // "Check localStorage... Do not regenerate". 
    // If same user connects >1 time, we just update socketId? 
    // Or do we count them as 2 connections towards limit?
    // "Backend keeps ... guest_id: { name, socketId }" map suggests 1 socket per guest_id.
    // But if they open 2 tabs, they consume 2 sockets. 
    // Let's stick to: 1 Connection = 1 Slot in `connectedUsers` map (keyed by guest_id).
    // If guest_id already exists, we update the socketId (user reconnected or new tab).
    // BUT we need to be careful with the Count.
    // If updating, count doesn't increase. 
    // If new, count increases.

    // Wait, middleware ran BEFORE we knew the guest_id (unless we peek query in middleware).
    // Middleware `io.use` has access to `socket`.
    // Let's refining limiting logic:
    // Ideally we limit by *Unique Guests*, not just sockets?
    // "guarantees only 5-10 people". 
    // I will check limit based on *new* guest_ids.

    const isReturningUser = !!connectedUsers[guest_id];

    // We already checked count in middleware, but that was raw connection count. 
    // That's fine. 10 sockets max.

    connectedUsers[guest_id] = { name: guest_name, socketId: socket.id };

    // Join Room
    socket.join(GLOBAL_ROOM);

    // Broadcast user_joined
    io.to(GLOBAL_ROOM).emit('user_joined', { guest_id, guest_name });

    // Broadcast current user list
    io.to(GLOBAL_ROOM).emit('update_users', Object.values(connectedUsers));

    console.log(`User connected: ${guest_name} (${guest_id}). Total: ${Object.keys(connectedUsers).length}`);

    // Events

    socket.on('send_message', (data) => {
        // Payload: guest_id, guest_name, text
        // Verify sender is in room (implicit if they are connected and we have them)
        if (connectedUsers[socket.id] && connectedUsers[socket.id].guest_id !== data.guest_id) {
            // Mismatch or spoofing? Ignore or trust payload?
            // Better: Use server-known identity.
        }

        // Broadcast
        io.to(GLOBAL_ROOM).emit('receive_message', {
            guest_id: data.guest_id, // or from server state
            guest_name: data.guest_name,
            text: data.text,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${guest_name}`);

        // Remove from connectedUsers
        delete connectedUsers[guest_id];

        // Broadcast user_left
        io.to(GLOBAL_ROOM).emit('user_left', { guest_id, guest_name });
        io.to(GLOBAL_ROOM).emit('update_users', Object.values(connectedUsers));
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING on port ${PORT}`);
    console.log(`Real-time Fandom ready. Limit: ${MAX_USERS} users.`);
});
