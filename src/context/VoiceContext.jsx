import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceService } from '../services/VoiceService';

const VoiceContext = createContext();

export const useVoice = () => useContext(VoiceContext);

export const VoiceProvider = ({ children }) => {
    const [voiceState, setVoiceState] = useState({
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

    return (
        <VoiceContext.Provider value={{
            ...voiceState,
            joinRoom,
            createRoom,
            leaveRoom,
            toggleMute,
            toggleDeafen
        }}>
            {children}
        </VoiceContext.Provider>
    );
};
