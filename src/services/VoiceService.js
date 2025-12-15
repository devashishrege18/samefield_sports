import { joinRoom } from 'trystero/torrent';

class VoiceService {
    constructor() {
        this.currentRoom = null;
        this.roomInstance = null;
        this.participants = [];
        this.listeners = [];
        this.localUser = {
            id: 'local_user',
            name: 'You (' + Math.floor(Math.random() * 1000) + ')',
            isMuted: true,
            isSpeaking: false
        };

        // Static Room List
        this.rooms = [
            { id: 'samefield_v1', name: 'General Chat', type: 'voice', users: [] },
            { id: 'samefield_v2', name: 'Match Watch Party', type: 'voice', users: [] },
            { id: 'samefield_v3', name: 'Gamers Lounge', type: 'voice', users: [] }
        ];

        this.simulationInterval = null;
        this.localStream = null;
        this.audioElements = {}; // Map peerId -> Audio Element
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notify() {
        this.listeners.forEach(cb => {
            try {
                cb({
                    currentRoom: this.currentRoom,
                    participants: [...this.participants],
                    rooms: this.rooms, // Static list for now
                    localUser: { ...this.localUser }
                });
            } catch (e) {
                console.error("VoiceService update failed:", e);
            }
        });
    }

    getRooms() { return this.rooms; }

    async joinRoom(roomId) {
        if (this.currentRoom?.id === roomId) return;
        if (this.currentRoom) await this.leaveRoom();

        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            console.log(`[Voice] Joining Room: ${roomId}`);
            this.currentRoom = room;
            this.participants = [this.localUser];
            room.users = this.participants; // Optimistic local update
            this.notify();

            // Initialize Trystero
            const config = { appId: 'samefield_sports_demo_v1' };
            this.roomInstance = joinRoom(config, roomId);

            // Handle Peer Join
            this.roomInstance.onPeerJoin(peerId => {
                console.log(`[Voice] Peer Joined: ${peerId}`);
                this.participants.push({ id: peerId, name: `User ${peerId.slice(0, 4)}`, isMuted: false, isSpeaking: false });
                this.notify();

                // If we have a local stream, send it to the new peer
                if (this.localStream && !this.localUser.isMuted) {
                    this.roomInstance.addStream(this.localStream, peerId);
                }
            });

            // Handle Peer Leave
            this.roomInstance.onPeerLeave(peerId => {
                console.log(`[Voice] Peer Left: ${peerId}`);
                this.participants = this.participants.filter(p => p.id !== peerId);
                if (this.audioElements[peerId]) {
                    this.audioElements[peerId].srcObject = null;
                    delete this.audioElements[peerId];
                }
                this.notify();
            });

            // Handle Incoming Stream
            this.roomInstance.onPeerStream((stream, peerId) => {
                console.log(`[Voice] Received Stream from: ${peerId}`);

                // Create audio element if not exists
                if (!this.audioElements[peerId]) {
                    const audio = new Audio();
                    audio.autoplay = true;
                    // audio.controls = true; // Debug
                    this.audioElements[peerId] = audio;
                }
                this.audioElements[peerId].srcObject = stream;

                // Update speaking state visual (basic)
                this.participants = this.participants.map(p =>
                    p.id === peerId ? { ...p, isSpeaking: true } : p
                );
                this.notify();
            });

            // Auto-init mic if not muted (or ask permission)
            // But usually we start muted.
        }
    }

    async leaveRoom() {
        if (!this.currentRoom) return;

        console.log(`[Voice] Leaving Room: ${this.currentRoom.id}`);

        if (this.roomInstance) {
            this.roomInstance.leave();
            this.roomInstance = null;
        }

        // Cleanup Audio
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.srcObject = null;
        });
        this.audioElements = {};

        // Stop Mic
        this.stopLocalStream();

        this.currentRoom = null;
        this.participants = [];
        this.notify();
    }

    async toggleMute() {
        this.localUser.isMuted = !this.localUser.isMuted;

        if (!this.localUser.isMuted) {
            // Unmuting -> Start Mic
            await this.startLocalStream();
        } else {
            // Muting -> Stop Mic
            this.stopLocalStream();
        }

        this.notify();
    }

    async startLocalStream() {
        try {
            if (this.localStream) return; // Already active

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.localStream = stream;

            // Send stream to all peers
            if (this.roomInstance) {
                this.roomInstance.addStream(this.localStream);
            }

            // Visualizer support (Optional, stripped for simplicity or re-add if needed)
            this.startMicMonitoring(stream);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied.");
            this.localUser.isMuted = true;
        }
    }

    stopLocalStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        if (this.roomInstance) {
            // Trystero removeStream keys off the stream ID usually, but simpler to just strictly control adding.
            // Removing streams in WebRTC is tricky, often easier to just stop tracks.
            // But we need to ensure peers stop hearing us. 
            // Trystero handles track ending automatically? Usually.
            // We can also re-join or use removeStream if exposed.
            // For this demo, stopping tracks works.
            if (this.roomInstance.removeStream) {
                // Try removing if API supports it, safely
                // this.roomInstance.removeStream(this.localStream); 
            }
        }
        this.stopMicMonitoring();
    }

    // --- Visualizer Logic (Reused) ---
    startMicMonitoring(stream) {
        if (!stream) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
            const isSpeaking = avg > 10;

            if (this.localUser.isSpeaking !== isSpeaking) {
                this.localUser.isSpeaking = isSpeaking;
                this.notify();
            }
        }, 100);
    }

    stopMicMonitoring() {
        if (this.simulationInterval) clearInterval(this.simulationInterval);
        this.localUser.isSpeaking = false;
        if (this.audioContext) this.audioContext.close();
        this.audioContext = null;
    }
}

export const voiceService = new VoiceService();
