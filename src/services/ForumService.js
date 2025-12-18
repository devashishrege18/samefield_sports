import { joinRoom } from 'trystero/nostr';
import { matches, players, threadTemplates, users } from './mockData';

class ForumService {
    constructor() {
        this.threads = [];
        this.room = null;
        this.sendAction = null;
        this.syncCallbacks = [];
        this.init();
        this.initP2PSync();
    }

    init() {
        // ... existing init logic ...
        matches.filter(m => m.status === 'LIVE').forEach(match => {
            this.createThread({
                title: `LIVE: ${match.team1} vs ${match.team2} - Match Thread`,
                author: 'System Bot',
                category: 'Live Match Reactions',
                matchId: match.id,
                isLive: true,
                aiTags: ['Trending', 'High Activity'],
                content: `Official live discussion thread for ${match.team1} vs ${match.team2}. Keep it civil!`,
                votes: 150 + Math.floor(Math.random() * 500)
            }, false); // don't broadcast initial bot threads
        });

        players.forEach(player => {
            this.createThread({
                title: `Player Focus: ${player.name}`,
                author: users[0].name,
                category: 'Player Performance Talk',
                playerId: player.id,
                aiTags: ['Analysis'],
                content: `Let's discuss ${player.name}'s recent form. Stats looking good?`,
                votes: 40 + Math.floor(Math.random() * 100)
            }, false);
        });

        this.createThread({
            title: "Why split-captaincy is the future of Mixed Cricket",
            author: 'TacticalGenius',
            category: 'Tactical Analysis',
            aiTags: ['Insightful', 'Long Read'],
            aiSummary: "User argues that having distinct captains for bowling and batting phases optimizes strategy in mixed-gender formats.",
            content: "I've been analyzing the win rates...",
            votes: 342
        }, false);
    }

    initP2PSync() {
        const RELAYS = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.snort.social'];
        const config = { appId: 'samefield_forum_sync_v1', relayUrls: RELAYS };

        try {
            this.room = joinRoom(config, 'global_forum');
            const [sendSync, getSync] = this.room.makeAction('sync');
            this.sendAction = sendSync;

            getSync((data) => {
                if (data.type === 'NEW_THREAD') {
                    // Prepend new remote threads
                    if (!this.threads.find(t => t.id === data.thread.id)) {
                        this.threads.unshift(data.thread);
                    }
                } else if (data.type === 'UPVOTE') {
                    const thread = this.threads.find(t => t.id === data.threadId);
                    if (thread) thread.votes += 1;
                } else if (data.type === 'ADD_COMMENT') {
                    const thread = this.threads.find(t => t.id === data.threadId);
                    if (thread) {
                        thread.comments = (thread.comments || 0) + 1;
                    }
                }
                this.syncCallbacks.forEach(cb => cb());
            });

            this.room.onPeerJoin(peerId => {
                // Optionally sync current state to new peers
            });
        } catch (e) {
            console.error("Forum Sync Failed", e);
        }
    }

    onSync(callback) {
        this.syncCallbacks.push(callback);
        return () => this.syncCallbacks = this.syncCallbacks.filter(c => c !== callback);
    }

    createThread(data, broadcast = true) {
        const thread = {
            id: 't' + (this.threads.length + 1) + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: new Date().toISOString(),
            comments: Math.floor(Math.random() * 50),
            ...data
        };
        this.threads.push(thread);

        if (broadcast && this.sendAction) {
            this.sendAction({ type: 'NEW_THREAD', thread });
        }

        return thread;
    }

    upvoteThread(threadId) {
        const thread = this.threads.find(t => t.id === threadId);
        if (thread) {
            thread.votes += 1;
            if (this.sendAction) {
                this.sendAction({ type: 'UPVOTE', threadId });
            }
        }
    }

    broadcastComment(threadId, comment) {
        const thread = this.threads.find(t => t.id === threadId);
        if (thread) {
            // Already added locally in UI in some flows, but service should maintain state
            thread.comments = (thread.comments || 0) + 1;
            if (this.sendAction) {
                this.sendAction({ type: 'ADD_COMMENT', threadId, comment });
            }
            // Trigger local sync so the sender's UI updates immediately
            this.syncCallbacks.forEach(cb => cb());
        }
    }

    getThreads(filter = 'All') {
        let list = [...this.threads];
        if (filter !== 'All') list = list.filter(t => t.category === filter);
        return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Simulate AI Moderation
    checkToxicity(text) {
        const badWords = ['hate', 'stupid', 'bad']; // Simple mock list
        return badWords.some(w => text.toLowerCase().includes(w));
    }

    simulateLiveActivity(callback) {
        // Keep bot/simulated activity local or controlled
        setInterval(() => {
            const liveThreads = this.threads.filter(t => t.isLive);
            if (liveThreads.length > 0) {
                const target = liveThreads[Math.floor(Math.random() * liveThreads.length)];
                target.votes += 1;
                target.comments += 1;
                callback(target.id);
            }
        }, 10000); // Slower simulated updates to avoid noise
    }
}

export const forumService = new ForumService();
