import { joinRoom } from 'trystero/torrent';

const SOUNDS = {
    JOIN: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA',
    LEAVE: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA'
};

// Robust Sound Player
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
        } else {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
        }
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) { console.error("Sound Error", e); }
};

class VoiceService {
    constructor() {
        // --- State ---
        this.currentRoom = null;
        this.roomInstance = null; // Active Voice Room
        this.presenceInstance = null; // Global Presence Swarm

        this.participants = []; // Active Voice Participants
        this.listeners = [];
        this.isTransiting = false; // Mutex for join/leave

        const savedName = localStorage.getItem('samefield_username');
        this.localUser = {
            id: 'local_user',
            name: savedName || 'You',
            isMuted: true,
            isSpeaking: false,
            isDeafened: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedName || 'You'}`
        };

        // Static Room Definitions
        this.rooms = [
            { id: 'samefield_v1', name: 'General Chat', type: 'voice', users: [] },
            { id: 'samefield_v2', name: 'Match Watch Party', type: 'voice', users: [] }
        ];

        // Global User Map (PeerID -> UserData)
        this.onlineUsers = {};
        this.lastHeartbeat = {}; // Map of timestamps for peer expiry

        this.simulationInterval = null;
        this.heartbeatInterval = null;
        this.audioElements = {};
        this.speakAction = null;
        this.presenceAction = null;

        // Auto-Start Global Presence
        setTimeout(() => this.initGlobalPresence(), 1000);

        // Listen for name updates
        window.addEventListener('usernameUpdated', () => {
            const newName = localStorage.getItem('samefield_username');
            if (newName) {
                this.localUser.name = newName;
                this.localUser.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`;
                this.broadcastPresence();
                this.notify();
            }
        });

        window.addEventListener('beforeunload', () => {
            this.leaveRoom();
            if (this.presenceInstance) this.presenceInstance.leave();
        });

        // Cleanup stale users every 10s
        setInterval(() => this.cleanupStaleUsers(), 10000);
    }

    // --- Core API ---

    getRooms() {
        // Merit: Dynamically map onlineUsers to rooms
        const roomsWithUsers = this.rooms.map(room => {
            const usersInRoom = Object.values(this.onlineUsers).filter(u => u.currentRoomId === room.id);

            // Append Local User if in this room (to ensure I see myself)
            if (this.currentRoom && this.currentRoom.id === room.id) {
                // Ensure I'm not added twice if my heartbeat looped back
                if (!usersInRoom.find(u => u.name === this.localUser.name)) {
                    usersInRoom.push(this.localUser);
                }
            }

            return {
                ...room,
                users: usersInRoom
            };
        });
        return roomsWithUsers;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notify() {
        this.listeners.forEach(cb => cb({
            currentRoom: this.currentRoom,
            participants: [...this.participants],
            rooms: this.getRooms(), // Always return hydrated rooms
            localUser: { ...this.localUser }
        }));
    }

    // --- Global Presence (The "Lobby") ---

    initGlobalPresence() {
        // Merit: Optimized Trackers for faster discovery
        const TRACKERS = [
            'wss://tracker.webtorrent.io',
            'wss://tracker.openwebtorrent.com',
            'wss://tracker.files.fm:7073/announce',
            'wss://tracker.btorrent.xyz'
        ];

        const config = {
            appId: 'samefield_sports_presence_v2',
            trackerUrls: TRACKERS
        };
        this.presenceInstance = joinRoom(config, 'global_lobby');

        const [sendPresence, getPresence] = this.presenceInstance.makeAction('status');
        this.presenceAction = sendPresence;

        // Handle incoming presence updates (HEARTBEAT)
        getPresence((data, peerId) => {
            this.onlineUsers[peerId] = {
                id: peerId,
                name: data.name,
                currentRoomId: data.currentRoomId,
                isSpeaking: false,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
            };
            this.lastHeartbeat[peerId] = Date.now();
            this.notify();
        });

        this.presenceInstance.onPeerJoin(peerId => {
            console.log(`[Presence] Peer Joined: ${peerId}`);
            this.broadcastPresence();
        });

        this.presenceInstance.onPeerLeave(peerId => {
            delete this.onlineUsers[peerId];
            delete this.lastHeartbeat[peerId];
            this.notify();
        });

        // Loop heartbeat every 4s
        this.heartbeatInterval = setInterval(() => this.broadcastPresence(), 4000);
        this.broadcastPresence();
    }

    cleanupStaleUsers() {
        const now = Date.now();
        Object.keys(this.lastHeartbeat).forEach(peerId => {
            if (now - this.lastHeartbeat[peerId] > 15000) {
                delete this.onlineUsers[peerId];
                delete this.lastHeartbeat[peerId];
            }
        });
        this.notify();
    }

    broadcastPresence() {
        if (this.presenceAction) {
            this.presenceAction({
                name: this.localUser.name,
                currentRoomId: this.currentRoom ? this.currentRoom.id : null
            });
        }
    }

    // --- Voice Logic ---

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
        // Mutex Check
        if (this.isTransiting) {
            console.warn("[Voice] Join blocked: Transiting.");
            return;
        }

        this.isTransiting = true;

        try {
            if (this.currentRoom?.id === roomId) return;
            if (this.currentRoom) await this.leaveRoom();

            const room = this.rooms.find(r => r.id === roomId);
            if (!room) return;

            console.log(`[Voice] Joining Room: ${roomId}`);
            this.currentRoom = room;

            // Optimistic Update
            this.broadcastPresence();
            this.notify();
            playSound('JOIN');

            // Init Voice Room Swarm
            const TRACKERS = [
                'wss://tracker.webtorrent.io',
                'wss://tracker.openwebtorrent.com',
                'wss://tracker.files.fm:7073/announce',
                'wss://tracker.btorrent.xyz'
            ];
            const config = {
                appId: 'samefield_sports_voice_v2',
                trackerUrls: TRACKERS
            };
            this.roomInstance = joinRoom(config, roomId);

            // Data Channels (Voice Specific)
            const [sendSpeaking, getSpeaking] = this.roomInstance.makeAction('speak');
            this.speakAction = sendSpeaking;

            getSpeaking((data, peerId) => {
                if (this.onlineUsers[peerId]) {
                    this.onlineUsers[peerId].isSpeaking = data.isSpeaking;
                    this.notify();
                }
            });

            this.roomInstance.onPeerJoin(peerId => {
                playSound('JOIN');
                if (this.localStream && !this.localUser.isMuted) {
                    this.roomInstance.addStream(this.localStream, peerId);
                }
            });

            this.roomInstance.onPeerLeave(peerId => {
                playSound('LEAVE');
                if (this.audioElements[peerId]) {
                    this.audioElements[peerId].srcObject = null;
                    delete this.audioElements[peerId];
                }
            });

            this.roomInstance.onPeerStream((stream, peerId) => {
                if (!this.audioElements[peerId]) {
                    const audio = new Audio();
                    audio.autoplay = true;
                    this.audioElements[peerId] = audio;
                }
                this.audioElements[peerId].srcObject = stream;
            });

        } catch (error) {
            console.error("[Voice] Join Error:", error);
            // Fallback: forcefully leave to clear state
            await this.leaveRoom();
        } finally {
            this.isTransiting = false; // RELEASE LOCK
        }
    }

    async leaveRoom() {
        if (!this.currentRoom) return;
        playSound('LEAVE');

        if (this.roomInstance) {
            this.roomInstance.leave(); // This is silent in Trystero usually
            this.roomInstance = null;
        }

        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.srcObject = null;
        });
        this.audioElements = {};
        this.speakAction = null;

        this.stopLocalStream();
        this.currentRoom = null;

        // Broadcast new location (null)
        this.broadcastPresence();
        this.notify();
    }

    // --- Controls ---

    async toggleMute() {
        this.localUser.isMuted = !this.localUser.isMuted;
        this.notify();
        if (!this.localUser.isMuted) await this.startLocalStream();
        else {
            this.stopLocalStream();
            if (this.speakAction) this.speakAction({ isSpeaking: false });
        }
    }

    toggleDeafen() {
        this.localUser.isDeafened = !this.localUser.isDeafened;
        this.localUser.isMuted = this.localUser.isDeafened ? true : this.localUser.isMuted;
        this.notify();
    }

    async startLocalStream() {
        try {
            if (this.localStream) return;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.localStream = stream;
            if (this.roomInstance) this.roomInstance.addStream(this.localStream);
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
                if (this.speakAction) this.speakAction({ isSpeaking: isSpeakingNow });
                this.notify();
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
