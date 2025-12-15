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

        // Static Room List (Removed Gaming Lounge)
        this.rooms = [
            { id: 'samefield_v1', name: 'General Chat', type: 'voice', users: [] },
            { id: 'samefield_v2', name: 'Match Watch Party', type: 'voice', users: [] }
        ];

        this.simulationInterval = null;
        this.localStream = null;
        this.audioElements = {}; // Map peerId -> Audio Element

        // Data Channels
        this.speakAction = null;

        // Cleanup on close
        window.addEventListener('beforeunload', () => this.leaveRoom());
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
                    rooms: this.rooms,
                    localUser: { ...this.localUser }
                });
            } catch (e) {
                console.error("VoiceService update failed:", e);
            }
        });
    }

    getRooms() { return this.rooms; }

    createRoom(name) {
        // Create a custom room object
        const newRoom = {
            id: 'custom_' + Date.now(),
            name: name,
            type: 'voice',
            users: []
        };
        this.rooms.push(newRoom);
        this.notify();
        // Converting to async flow internally to join immediately
        this.joinRoom(newRoom.id);
    }

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

            // --- Data Channels ---
            // Create action for broadcasting speaking status
            // Trystero action topics must be <= 12 chars
            const [sendSpeaking, getSpeaking] = this.roomInstance.makeAction('speak');
            this.speakAction = sendSpeaking;

            // Handle Incoming Speaking Status
            getSpeaking((data, peerId) => {
                this.participants = this.participants.map(p =>
                    p.id === peerId ? { ...p, isSpeaking: data.isSpeaking } : p
                );
                this.notify();
            });

            // Handle Peer Join
            this.roomInstance.onPeerJoin(peerId => {
                console.log(`[Voice] Peer Joined: ${peerId}`);
                // Check if already in list to avoid dupes
                if (!this.participants.find(p => p.id === peerId)) {
                    this.participants.push({ id: peerId, name: `User ${peerId.slice(0, 4)}`, isMuted: false, isSpeaking: false });
                    this.notify();
                }

                // If we have a local stream, send it to the new peer
                if (this.localStream && !this.localUser.isMuted) {
                    this.roomInstance.addStream(this.localStream, peerId);
                }

                // Send our current speaking status to new peer
                if (this.speakAction) {
                    this.speakAction({ isSpeaking: this.localUser.isSpeaking });
                }
            });

            // Handle Peer Leave
            this.roomInstance.onPeerLeave(peerId => {
                console.log(`[Voice] Peer Left: ${peerId}`);
                this.removePeer(peerId);
            });

            // Handle Incoming Stream
            this.roomInstance.onPeerStream((stream, peerId) => {
                console.log(`[Voice] Received Stream from: ${peerId}`);

                // Create audio element if not exists
                if (!this.audioElements[peerId]) {
                    const audio = new Audio();
                    audio.autoplay = true;
                    this.audioElements[peerId] = audio;
                }
                this.audioElements[peerId].srcObject = stream;
            });
        }
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
        this.speakAction = null;

        // Stop Mic
        this.stopLocalStream();

        this.currentRoom = null;
        this.participants = [];
        this.notify();
    }

    async toggleMute() {
        this.localUser.isMuted = !this.localUser.isMuted;
        this.notify(); // Update UI immediately

        if (!this.localUser.isMuted) {
            // Unmuting -> Start Mic
            await this.startLocalStream();
        } else {
            // Muting -> Stop Mic
            this.stopLocalStream();

            // Explicitly broadcast "Not Speaking" when muting
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
        if (this.roomInstance && this.roomInstance.removeStream) {
            // this.roomInstance.removeStream(this.localStream); 
        }
        this.stopMicMonitoring();
    }

    // --- Visualizer & State Broadcast ---
    startMicMonitoring(stream) {
        if (!stream) return;

        if (this.audioContext) this.audioContext.close();
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
            const isSpeakingNow = avg > 15; // Slightly higher threshold to avoid noise

            if (this.localUser.isSpeaking !== isSpeakingNow) {
                this.localUser.isSpeaking = isSpeakingNow;
                this.notify();

                // BROADCAST STATUS TO PEERS
                if (this.speakAction) {
                    this.speakAction({ isSpeaking: isSpeakingNow });
                }
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
        // Broadcast "Silence" to be safe
        if (this.speakAction) {
            this.speakAction({ isSpeaking: false });
        }
    }
}

export const voiceService = new VoiceService();
