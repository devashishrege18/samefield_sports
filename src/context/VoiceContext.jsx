import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceService } from '../services/VoiceService';

const VoiceContext = createContext();

export const useVoice = () => useContext(VoiceContext);

export const VoiceProvider = ({ children }) => {
    const [voiceState, setVoiceState] = useState({
<<<<<<< HEAD
        rooms: [],
        currentRoom: null,
        localUser: { isMuted: true, isVideoEnabled: false, isDeafened: false },
        remoteStreams: {},
        localStream: null
    });

    useEffect(() => {
        const updateState = (state) => {
            if (state) {
                setVoiceState({
                    rooms: state.rooms || [],
                    currentRoom: state.currentRoom || null,
                    localUser: state.localUser || { isMuted: true, isVideoEnabled: false, isDeafened: false },
                    remoteStreams: state.remoteStreams || {},
                    localStream: state.localStream || null
                });
            }
        };

        const unsubscribe = voiceService.subscribe(updateState);
        return unsubscribe;
    }, []);

    const joinRoom = (roomId) => voiceService.joinRoom(roomId);
    const leaveRoom = () => voiceService.leaveRoom();
    const toggleMute = () => voiceService.toggleMute();
    const toggleVideo = () => voiceService.toggleVideo();
    const createRoom = (name) => voiceService.createRoom(name);
=======
        currentRoom: null,
        participants: [],
        rooms: voiceService.getRooms(),
        localUser: voiceService.localUser
    });

    useEffect(() => {
        const unsubscribe = voiceService.subscribe((newState) => {
            setVoiceState(newState);
        });
        return () => unsubscribe();
    }, []);

    const joinRoom = (roomId) => voiceService.joinRoom(roomId);
    const createRoom = (name) => voiceService.createRoom(name);
    const leaveRoom = () => voiceService.leaveRoom();
    const toggleMute = () => voiceService.toggleMute();
    const toggleDeafen = () => voiceService.toggleDeafen();
>>>>>>> a8252db (Done)

    return (
        <VoiceContext.Provider value={{
            ...voiceState,
            joinRoom,
<<<<<<< HEAD
            leaveRoom,
            createRoom,
            toggleMute,
            toggleVideo
=======
            createRoom,
            leaveRoom,
            toggleMute,
            toggleDeafen
>>>>>>> a8252db (Done)
        }}>
            {children}
        </VoiceContext.Provider>
    );
};
