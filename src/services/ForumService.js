import { matches, players, threadTemplates, users } from './mockData';

class ForumService {
    constructor() {
        this.threads = [];
        this.init();
    }

    init() {
        // 1. Auto-generate Live Match Threads
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
            });
        });

        // 2. Auto-generate Player Threads
        players.forEach(player => {
            this.createThread({
                title: `Player Focus: ${player.name}`,
                author: users[0].name,
                category: 'Player Performance Talk',
                playerId: player.id,
                aiTags: ['Analysis'],
                content: `Let's discuss ${player.name}'s recent form. Stats looking good?`,
                votes: 40 + Math.floor(Math.random() * 100)
            });
        });

        // 3. Random Tactical Threads
        this.createThread({
            title: "Why split-captaincy is the future of Mixed Cricket",
            author: 'TacticalGenius',
            category: 'Tactical Analysis',
            aiTags: ['Insightful', 'Long Read'],
            aiSummary: "User argues that having distinct captains for bowling and batting phases optimizes strategy in mixed-gender formats.",
            content: "I've been analyzing the win rates...",
            votes: 342
        });
    }

    createThread(data) {
        const thread = {
            id: 't' + (this.threads.length + 1),
            timestamp: new Date().toISOString(),
            comments: Math.floor(Math.random() * 50),
            ...data
        };
        this.threads.push(thread);
        return thread;
    }

    getThreads(filter = 'All') {
        if (filter === 'All') return this.threads.sort((a, b) => b.votes - a.votes);
        return this.threads.filter(t => t.category === filter).sort((a, b) => b.votes - a.votes);
    }

    // Simulate AI Moderation
    checkToxicity(text) {
        const badWords = ['hate', 'stupid', 'bad']; // Simple mock list
        return badWords.some(w => text.toLowerCase().includes(w));
    }

    // Simulate Real-time updates
    simulateLiveActivity(callback) {
        setInterval(() => {
            const liveThreads = this.threads.filter(t => t.isLive);
            if (liveThreads.length > 0) {
                const target = liveThreads[Math.floor(Math.random() * liveThreads.length)];
                target.votes += 1;
                target.comments += 1;
                callback(target.id); // Notify UI of update
            }
        }, 3000);
    }
}

export const forumService = new ForumService();
