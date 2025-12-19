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

        // Initialize with seed data if empty
        const snapshot = await getDocs(collection(db, 'threads'));
        if (snapshot.empty) {
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
                comments: 42,
                content: "I've been analyzing the win rates...",
                timestamp: serverTimestamp()
            },
            {
                title: "India vs Australia - Match Thread",
                author: 'System Bot',
                category: 'Live Match Reactions',
                votes: 156,
                comments: 89,
                isLive: true,
                content: `Official live discussion thread. Keep it civil!`,
                timestamp: serverTimestamp()
            }
        ];

        for (const thread of initialThreads) {
            await addDoc(collection(db, 'threads'), thread);
        }
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
