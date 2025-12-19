import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    doc,
    increment,
    serverTimestamp,
    getDocs,
    where
} from 'firebase/firestore';

class ForumService {
    constructor() {
        this.threads = [];
        this.syncCallbacks = [];
        this.init();
    }

    async init() {
        const q = query(collection(db, 'threads'), orderBy('votes', 'desc'));
        onSnapshot(q, (snapshot) => {
            this.threads = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            }));
            this.syncCallbacks.forEach(cb => cb());
        });

        // Initialize with seed data if too few threads remain
        const snapshot = await getDocs(collection(db, 'threads'));
        if (snapshot.size < 5) {
            this.seedData();
        }
    }

    async seedData() {
        const initialThreads = [
            {
                title: "Why split-captaincy is the future of Mixed Cricket",
                author: 'TacticalGenius',
                category: 'Tactical Analysis',
                votes: 342,
                comments: 5,
                content: "I've been analyzing the win rates of teams with dual leadership. The split in workload between batting and bowling specialists as captains shows a 12% improvement in decision-making speed.",
                timestamp: serverTimestamp(),
                aiSummary: "Analysis suggests 12% boost in strategic speed via dual leadership.",
                aiTags: ["Strategy", "Metrics"]
            },
            {
                title: "India vs Australia - Match Thread",
                author: 'System Bot',
                category: 'Live Match Reactions',
                votes: 156,
                comments: 12,
                isLive: true,
                content: `Official live discussion thread for the heavyweight clash. Keep it civil and focus on the game!`,
                timestamp: serverTimestamp(),
                aiSummary: "Live tracking of IND vs AUS game events.",
                aiTags: ["Live", "Trending"]
            },
            {
                title: "Caitlin Clark: Redefining the Guard Position",
                author: 'HoopsMaster',
                category: 'Player Performance Talk',
                votes: 890,
                comments: 45,
                content: "The way she scans the floor is reminiscent of prime Bird. Her range is just the tip of the iceberg.",
                timestamp: serverTimestamp(),
                aiSummary: "Deep dive into Clark's playmaking and court vision.",
                aiTags: ["WNBA", "GOAT-Talk"]
            },
            {
                title: "RCB Women: The Unstoppable Momentum",
                author: 'WPL_Fanatic',
                category: 'Live Match Reactions',
                votes: 620,
                comments: 31,
                content: "Is this the strongest lineup in league history? The balance between Perry and Mandhana is perfect.",
                timestamp: serverTimestamp(),
                aiSummary: "Fans debating if RCB W is the most balanced team ever.",
                aiTags: ["WPL", "RCB"]
            },
            {
                title: "AI in Sports: Prediction or Spoilers?",
                author: 'DataSciFan',
                category: 'Fan Predictions',
                votes: 215,
                comments: 18,
                content: "With LLMs predicting player moves, are we losing the magic of the unexpected?",
                timestamp: serverTimestamp(),
                aiSummary: "Community debate on AI's role in sports anticipation.",
                aiTags: ["AI", "Ethics"]
            }
        ];

        for (const thread of initialThreads) {
            await addDoc(collection(db, 'threads'), thread);
        }
    }

    async broadcastComment(threadId, comment) {
        // Alias for addComment to fix UI crash
        return this.addComment(threadId, comment);
    }

    onSync(callback) {
        this.syncCallbacks.push(callback);
        return () => this.syncCallbacks = this.syncCallbacks.filter(c => c !== callback);
    }

    async createThread(data) {
        const thread = {
            ...data,
            timestamp: serverTimestamp(),
            votes: data.votes || 0,
            comments: 0
        };
        const docRef = await addDoc(collection(db, 'threads'), thread);
        return { id: docRef.id, ...thread };
    }

    async upvoteThread(threadId) {
        const threadRef = doc(db, 'threads', threadId);
        await updateDoc(threadRef, {
            votes: increment(1)
        });
    }

    async addComment(threadId, comment) {
        // Adding comment to a subcollection
        const commentsRef = collection(db, 'threads', threadId, 'comments');
        await addDoc(commentsRef, {
            ...comment,
            timestamp: serverTimestamp()
        });

        // Increment comment count on thread
        const threadRef = doc(db, 'threads', threadId);
        await updateDoc(threadRef, {
            comments: increment(1)
        });
    }

    getThreads(filter = 'All') {
        let list = [...this.threads];
        if (filter !== 'All') list = list.filter(t => t.category === filter);
        return list;
    }

    subscribeToComments(threadId, callback) {
        const q = query(collection(db, 'threads', threadId, 'comments'), orderBy('timestamp', 'asc'));
        return onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            }));
            callback(comments);
        });
    }

    simulateLiveActivity(callback) {
        // Placeholder for legacy support to prevent crashes
        console.log("Forum simulation active (LEGACY)");
        return () => { };
    }
}

export const forumService = new ForumService();
