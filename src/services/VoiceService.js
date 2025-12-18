import { joinRoom } from 'trystero/torrent';

const SOUNDS = {
    JOIN: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA',
    LEAVE: 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xUAA5CAAIAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA//uQRAAAAwMSLwQlQACAxIvBCVAAAeF8AAUSB923m+uAgKCgACAICAgICAAACLiLuOIjMzOjo6UiAKvp5MPAxf9DnrH8q0cjrD/7f/2/y4ggAA'
};

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
        this.currentRoom = null;
        this.roomInstance = null;
        this.presenceInstance = null;

        this.participants = [];
        this.listeners = [];
        this.isTransiting = false;

        const savedName = localStorage.getItem('samefield_username');
        this.localUser = {
            id: 'local_user',
            name: savedName || 'You',
            isMuted: true,
            isVideoEnabled: false,
            isSpeaking: false,
            isDeafened: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedName || 'You'}`
        };

        this.rooms = [
            { id: 'samefield_v1', name: 'General Chat', type: 'voice', users: [] },
            { id: 'samefield_v2', name: 'Match Watch Party', type: 'voice', users: [] }
        ];

        this.onlineUsers = {};
        this.lastHeartbeat = {};
        this.simulationInterval = null;
        this.heartbeatInterval = null;
        this.remoteStreams = {}; // peerId -> stream
        this.speakAction = null;
        this.presenceAction = null;

        setTimeout(() => this.initGlobalPresence(), 1000);

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

        window.voiceService = this;
        setInterval(() => this.cleanupStaleUsers(), 10000);
    }

    getRooms() {
        const roomsWithUsers = this.rooms.map(room => {
            // Filter out the local user from the presence list to avoid seeing yourself as a remote peer
            const usersInRoom = Object.values(this.onlineUsers)
                .filter(u => u.currentRoomId === room.id && u.name !== this.localUser.name)
                .map(u => ({ ...u, isLocal: false }));

            if (this.currentRoom && this.currentRoom.id === room.id) {
                // Manually add the local user with isLocal: true
                usersInRoom.push({ ...this.localUser, isLocal: true });
            }

            return { ...room, users: usersInRoom };
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
            rooms: this.getRooms(),
            localUser: { ...this.localUser },
            remoteStreams: { ...this.remoteStreams },
            localStream: this.localStream
        }));
    }

    initGlobalPresence() {
        if (this.presenceInstance) return;
        const TRACKERS = ['wss://tracker.webtorrent.io', 'wss://tracker.openwebtorrent.com'];
        const config = { appId: 'samefield_sports_global_presence', trackerUrls: TRACKERS };

        try {
            this.presenceInstance = joinRoom(config, 'lobby');
            const [sendPresence, getPresence] = this.presenceInstance.makeAction('presence');
            this.presenceAction = sendPresence;

            getPresence((data, peerId) => {
                this.onlineUsers[peerId] = {
                    id: peerId,
                    name: data.name,
                    currentRoomId: data.currentRoomId,
                    isVideoEnabled: data.isVideoEnabled || false,
                    isSpeaking: false,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
                };
                this.lastHeartbeat[peerId] = Date.now();
                this.notify();
            });

            this.presenceInstance.onPeerJoin(peerId => {
                this.broadcastPresence();
            });

            this.presenceInstance.onPeerLeave(peerId => {
                delete this.onlineUsers[peerId];
                delete this.lastHeartbeat[peerId];
                this.notify();
            });

            this.heartbeatInterval = setInterval(() => this.broadcastPresence(), 4000);
            this.broadcastPresence();
        } catch (e) {
            console.error("Global Presence Failed", e);
        }
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
                currentRoomId: this.currentRoom ? this.currentRoom.id : null,
                isVideoEnabled: this.localUser.isVideoEnabled
            });
        }
    }

    async joinRoom(roomId) {
        if (this.isTransiting) return;
        this.isTransiting = true;

        try {
            if (this.currentRoom?.id === roomId) return;
            if (this.currentRoom) await this.leaveRoom();

            const room = this.rooms.find(r => r.id === roomId);
            if (!room) return;

            this.currentRoom = room;
            this.broadcastPresence();
            this.notify();
            playSound('JOIN');

            const TRACKERS = ['wss://tracker.webtorrent.io', 'wss://tracker.openwebtorrent.com'];
            const config = { appId: 'samefield_sports_voice_v3', trackerUrls: TRACKERS };
            this.roomInstance = joinRoom(config, roomId);

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
                if (this.localStream) this.roomInstance.addStream(this.localStream, peerId);
            });

            this.roomInstance.onPeerLeave(peerId => {
                playSound('LEAVE');
                delete this.remoteStreams[peerId];
                this.notify();
            });

            this.roomInstance.onPeerStream((stream, peerId) => {
                this.remoteStreams[peerId] = stream;
                this.notify();
            });

            // If audio or video was already enabled, restart the stream to include the roomInstance
            if (!this.localUser.isMuted || this.localUser.isVideoEnabled) {
                await this.updateMediaStream();
            }

        } catch (error) {
            console.error("[Voice] Join Error:", error);
            await this.leaveRoom();
        } finally {
            this.isTransiting = false;
        }
    }

    async leaveRoom() {
        if (!this.currentRoom) return;
        playSound('LEAVE');

        if (this.roomInstance) {
            this.roomInstance.leave();
            this.roomInstance = null;
        }

        this.remoteStreams = {};
        this.speakAction = null;
        this.stopLocalStream();
        this.currentRoom = null;
        this.broadcastPresence();
        this.notify();
    }

    async toggleMute() {
        this.localUser.isMuted = !this.localUser.isMuted;
        await this.updateMediaStream();
        this.notify();
    }

    async toggleVideo() {
        this.localUser.isVideoEnabled = !this.localUser.isVideoEnabled;
        await this.updateMediaStream();
        this.notify();
    }

    async updateMediaStream() {
        this.stopLocalStream();

        const constraints = {
            audio: !this.localUser.isMuted,
            video: this.localUser.isVideoEnabled
        };

        if (constraints.audio || constraints.video) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.localStream = stream;
                if (this.roomInstance) this.roomInstance.addStream(stream);

                if (constraints.audio) this.startMicMonitoring(stream);
                this.broadcastPresence();
            } catch (err) {
                console.error("Media Access Denied:", err);
                this.localUser.isMuted = true;
                this.localUser.isVideoEnabled = false;
            }
        } else {
            this.broadcastPresence();
            this.notify();
        }
    }

    stopLocalStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        this.stopMicMonitoring();
        this.notify();
    }

    startMicMonitoring(stream) {
        if (!stream || stream.getAudioTracks().length === 0) return;
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
