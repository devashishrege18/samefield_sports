import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    serverTimestamp,
    deleteDoc,
    doc,
    getDocs,
    where
} from 'firebase/firestore';

class StreamChatService {
    constructor() {
        this.messages = [];
        this.listeners = [];
        this.unsubscribe = null;
        this.currentRoom = null;
    }

    init(videoId) {
        if (this.unsubscribe) this.unsubscribe();
        this.currentRoom = videoId;

        const q = query(
            collection(db, 'watch_chats', videoId, 'messages'),
            orderBy('timestamp', 'asc'),
            limit(100)
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            this.messages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    isSelf: data.userId === localStorage.getItem('samefield_p2p_id'),
                    // Handle Firestore Timestamp
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().getTime() : Date.now()
                };
            });
            this.notify('messages', this.messages);
        });

        // Run one-time cleanup for the developer/tester messages
        this.cleanupTesterMessages(videoId);
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notify(type, payload) {
        this.listeners.forEach(cb => cb(type, payload));
    }

    async sendMessage(text, username) {
        if (!this.currentRoom || !text.trim()) return;

        const userId = localStorage.getItem('samefield_p2p_id');
        const msg = {
            user: username || 'Fan',
            userId: userId,
            text: text,
            timestamp: serverTimestamp(),
            type: 'chat'
        };

        await addDoc(collection(db, 'watch_chats', this.currentRoom, 'messages'), msg);
    }

    async sendReaction(type) {
        if (!this.currentRoom) return;

        // Reactions can still be transient or small firestore writes
        // For simplicity and speed in a live stream, we can use a dedicated reactions collection
        await addDoc(collection(db, 'watch_chats', this.currentRoom, 'reactions'), {
            type,
            timestamp: serverTimestamp()
        });
        this.notify('reaction', type);
    }

    async deleteMessage(messageId) {
        if (!this.currentRoom) return;
        const msgRef = doc(db, 'watch_chats', this.currentRoom, 'messages', messageId);
        await deleteDoc(msgRef);
        console.log(`[StreamChat] Deleted message: ${messageId}`);
    }

    async cleanupTesterMessages(videoId) {
        // DISABLED - This was deleting real user messages
        // The cleanup was too aggressive and deleted messages from 'Fan' users
        // which is the default username for all users
        console.log('[StreamChat] Cleanup disabled - messages preserved');
        return;
    }

    leave() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        this.currentRoom = null;
    }
}

export const streamChatService = new StreamChatService();
