import { joinRoom } from 'trystero/torrent';

const TRACKERS = [
    'wss://tracker.webtorrent.io',
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.files.fm:7073/announce',
    'wss://tracker.btorrent.xyz',
    'wss://open.demo.webtorrent.io'
];

class StreamChatService {
    constructor() {
        this.room = null;
        this.chatAction = null;
        this.reactionAction = null;
        this.listeners = [];
        this.messages = [];

        // Mock initial messages
        this.messages = [
            { id: 'sys_1', user: 'System', text: 'Welcome to the Live Chat! Stay respectful.', type: 'system' },
            { id: 'mock_1', user: 'Alex', text: 'Who is winning?', timestamp: Date.now() - 50000 }
        ];
    }

    init(videoId) {
        if (this.room) this.room.leave();

        const config = {
            appId: 'samefield_stream_chat_v1_' + videoId, // Unique room per video
            trackerUrls: TRACKERS
        };

        this.room = joinRoom(config, 'watch_party_chat');

        const [sendMsg, getMsg] = this.room.makeAction('chat');
        const [sendReact, getReact] = this.room.makeAction('react');

        this.chatAction = sendMsg;
        this.reactionAction = sendReact;

        getMsg((data, peerId) => {
            const msg = { ...data, isSelf: false, timestamp: Date.now() };
            this.messages.push(msg);
            this.notify('message', msg);
        });

        getReact((data, peerId) => {
            this.notify('reaction', data.type); // 'heart', 'fire', '100'
        });

        this.room.onPeerJoin(peerId => {
            console.log(`[StreamChat] Peer connected: ${peerId}`);
        });
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notify(type, payload) {
        this.listeners.forEach(cb => cb(type, payload));
    }

    sendMessage(text, username) {
        if (!text.trim()) return;
        const msg = {
            id: Date.now() + Math.random().toString(36),
            user: username || 'Fan',
            text: text,
            timestamp: Date.now(),
            isSelf: true
        };
        this.messages.push(msg);
        if (this.chatAction) this.chatAction(msg);
        this.notify('message', msg);
    }

    sendReaction(type) {
        if (this.reactionAction) this.reactionAction({ type });
    }

    leave() {
        if (this.room) {
            this.room.leave();
            this.room = null;
        }
    }
}

export const streamChatService = new StreamChatService();
