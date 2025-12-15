import { joinRoom } from 'trystero/torrent';

// Notification Sounds (Base64 for reliability)
const SOUNDS = {
    JOIN: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA', // Short "Pop"
    LEAVE: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA' // Placeholder (same for now, ideally distinct)
};

// BETTER SOUNDS (Mock URLs - browsers might block auto-play if not user initiated, but we'll try)
// Using a simple beep context for robust sound generation without external files
const playSound = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'JOIN') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        }
    } catch (e) { console.error("Sound Error", e); }
};

class VoiceService {
    constructor() {
        this.currentRoom = null;
        this.roomInstance = null;
        this.participants = [];
        this.listeners = [];

        const savedName = localStorage.getItem('samefield_username');
        this.localUser = {
            id: 'local_user',
            name: savedName || 'You',
            isMuted: true,
            isSpeaking: false,
            // Add a unique suffix to ID to differentiate tabs in same browser if needed, 
            // though Trystero handles peer IDs. We keep 'local_user' for UI logic.
        };

        // Static Room List
        this.rooms = [
            { id: 'samefield_v1', name: 'General Chat', type: 'voice', users: [] },
            { id: 'samefield_v2', name: 'Match Watch Party', type: 'voice', users: [] }
        ];

        this.simulationInterval = null;
        this.audioElements = {};
        this.speakAction = null;
        this.metaAction = null; // For name syncing

        // Listen for name updates
        window.addEventListener('usernameUpdated', () => {
            const newName = localStorage.getItem('samefield_username');
            if (newName) {
                this.localUser.name = newName;
                this.notify();
            }
        });

        // Cleanup
        window.addEventListener('beforeunload', () => this.leaveRoom());
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notify() {
        this.listeners.forEach(cb => cb({
            currentRoom: this.currentRoom,
            participants: [...this.participants],
            rooms: this.rooms,
            localUser: { ...this.localUser }
        }));
    }

    createRoom(name) {
        const newRoom = {
            id: 'custom_' + Date.now(),
            name: name,
            type: 'voice',
            users: []
        };
        this.rooms.push(newRoom);
        this.notify();
        this.joinRoom(newRoom.id);
    }

    async joinRoom(roomId) {
        // Ensure clean state before joining
        if (this.currentRoom) await this.leaveRoom();

        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        console.log(`[Voice] Joining Room: ${roomId}`);
        this.currentRoom = room;
        this.participants = [this.localUser];
        room.users = this.participants;
        this.notify();

        playSound('JOIN');

        // Initialize Trystero
        const config = { appId: 'samefield_sports_demo_v2' }; // Changed AppID to force fresh peers if needed
        this.roomInstance = joinRoom(config, roomId);

        // --- Data Channels ---
        const [sendSpeaking, getSpeaking] = this.roomInstance.makeAction('speak');
        this.speakAction = sendSpeaking;

        const [sendMeta, getMeta] = this.roomInstance.makeAction('meta'); // For Name Sync
        this.metaAction = sendMeta;

        // Handlers
        getSpeaking((data, peerId) => {
            this.participants = this.participants.map(p =>
                p.id === peerId ? { ...p, isSpeaking: data.isSpeaking } : p
            );
            this.notify();
        });

        getMeta((data, peerId) => {
            if (data.name) {
                this.participants = this.participants.map(p =>
                    p.id === peerId ? { ...p, name: data.name } : p
                );
                this.notify();
            }
        });

        this.roomInstance.onPeerJoin(peerId => {
            console.log(`[Voice] Peer Joined: ${peerId}`);
            playSound('JOIN');

            // Add peer placeholder (waiting for name)
            if (!this.participants.find(p => p.id === peerId)) {
                this.participants.push({
                    id: peerId,
                    name: `User ${peerId.slice(0, 4)}`, // Fallback
                    isMuted: false,
                    isSpeaking: false
                });
                this.notify();
            }

            // Broadcast MY details to the new peer
            if (this.metaAction) this.metaAction({ name: this.localUser.name });
            if (this.speakAction) this.speakAction({ isSpeaking: this.localUser.isSpeaking });

            if (this.localStream && !this.localUser.isMuted) {
                this.roomInstance.addStream(this.localStream, peerId);
            }
        });

        this.roomInstance.onPeerLeave(peerId => {
            console.log(`[Voice] Peer Left: ${peerId}`);
            playSound('LEAVE');
            this.removePeer(peerId);
        });

        this.roomInstance.onPeerStream((stream, peerId) => {
            if (!this.audioElements[peerId]) {
                const audio = new Audio();
                audio.autoplay = true;
                this.audioElements[peerId] = audio;
            }
            this.audioElements[peerId].srcObject = stream;
        });

        // Broadcast my name immediately to anyone already there
        if (this.metaAction) setTimeout(() => this.metaAction({ name: this.localUser.name }), 500);
    }

    removePeer(peerId) {
        this.participants = this.participants.filter(p => p.id !== peerId);
        if (this.currentRoom) {
            this.currentRoom.users = this.participants;
        }
        if (this.audioElements[peerId]) {
            this.audioElements[peerId].srcObject = null;
            delete this.audioElements[peerId];
        }
        this.notify();
    }

    async leaveRoom() {
        if (!this.currentRoom) return;
        playSound('LEAVE');

        console.log(`[Voice] Leaving Room: ${this.currentRoom.id}`);

        if (this.roomInstance) {
            this.roomInstance.leave();
            this.roomInstance = null;
        }

        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.srcObject = null;
        });
        this.audioElements = {};
        this.speakAction = null;
        this.metaAction = null;

        this.stopLocalStream();

        // Remove local user from static room list
        this.currentRoom.users = this.currentRoom.users.filter(u => u.id !== this.localUser.id);

        this.currentRoom = null;
        this.participants = [];
        this.notify();
    }

    async toggleMute() {
        this.localUser.isMuted = !this.localUser.isMuted;
        this.notify();

        if (!this.localUser.isMuted) {
            await this.startLocalStream();
        } else {
            this.stopLocalStream();
            if (this.speakAction) this.speakAction({ isSpeaking: false });
        }
    }

    async startLocalStream() {
        try {
            if (this.localStream) return;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.localStream = stream;

            if (this.roomInstance) {
                this.roomInstance.addStream(this.localStream);
            }
            this.startMicMonitoring(stream);
        } catch (err) {
            console.error("Mic denied:", err);
            this.localUser.isMuted = true;
        }
    }

    stopLocalStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        this.stopMicMonitoring();
    }

    startMicMonitoring(stream) {
        if (!stream) return;
        if (this.audioContext) this.audioContext.close();

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);
        this.analyser.fftSize = 256;
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.simulationInterval = setInterval(() => {
            if (!this.currentRoom || this.localUser.isMuted) return;

            this.analyser.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const avg = sum / dataArray.length;
            const isSpeakingNow = avg > 15;

            if (this.localUser.isSpeaking !== isSpeakingNow) {
                this.localUser.isSpeaking = isSpeakingNow;
                this.notify();
                if (this.speakAction) this.speakAction({ isSpeaking: isSpeakingNow });
            }
        }, 100);
    }

    stopMicMonitoring() {
        if (this.simulationInterval) clearInterval(this.simulationInterval);
        this.localUser.isSpeaking = false;
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        if (this.speakAction) this.speakAction({ isSpeaking: false });
    }
}

export const voiceService = new VoiceService();
