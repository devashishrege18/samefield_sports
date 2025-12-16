import React from 'react';
import { useVoice } from '../../context/VoiceContext';
import { Mic, MicOff, Headphones, VolumeX, Volume2, Users, LogOut } from 'lucide-react';
import { Plus } from 'lucide-react';

const RoomList = () => {
    const {
        rooms,
        currentRoom,
        joinRoom,
        createRoom,
        leaveRoom,
        toggleMute,
        toggleDeafen,
        localUser
    } = useVoice();

    return (
        <div className="w-80 h-full bg-surface border-l border-surfaceHighlight flex flex-col flex-shrink-0 z-20">
            {/* Header */}
            <div className="h-20 flex flex-col justify-center px-6 border-b border-surfaceHighlight">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-primary" />
                        Voice Rooms
                    </h3>
                    <button
                        onClick={() => {
                            const name = prompt("Enter Room Name:");
                            if (name) createRoom(name);
                        }}
                        className="p-1.5 rounded-full bg-surfaceHighlight hover:bg-primary hover:text-black transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-1 pl-7">Watch Together • Talk Live</p>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {rooms.map(room => (
                    <div key={room.id}>
                        {/* Channel Header */}
                        <div
                            onClick={() => joinRoom(room.id)}
                            className={`
                                group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors mb-2
                                ${currentRoom?.id === room.id ? 'bg-surfaceHighlight/50' : 'hover:bg-surfaceHighlight/30'}
                            `}
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                                    <Volume2 className="w-4 h-4" />
                                    <span className="font-bold text-sm uppercase tracking-wide">{room.name}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 ml-6">
                                    {room.users.length > 0 ? `${room.users.length} listener${room.users.length !== 1 ? 's' : ''}` : 'Empty Room'}
                                </span>
                            </div>
                        </div>

                        {/* Connected Users (Tree View) */}
                        <div className="ml-6 space-y-2">
                            {room.users.map(user => (
                                <div key={user.id} className="flex items-center gap-3 animate-fade-in">
                                    <div className={`relative w-8 h-8 rounded-full border-2 p-0.5 transition-all duration-300 ${user.isSpeaking
                                        ? 'border-green-500 ring-4 ring-green-500/30 scale-105'
                                        : 'border-transparent'
                                        }`}>
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full bg-black/50" />
                                        {user.isMuted && !user.isDeafened && (
                                            <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
                                                <MicOff className="w-3 h-3 text-red-500" />
                                            </div>
                                        )}
                                        {user.isDeafened && (
                                            <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
                                                <VolumeX className="w-3 h-3 text-red-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold leading-none ${user.id === localUser.id ? 'text-primary' : 'text-gray-300'}`}>
                                            {user.name}
                                        </p>
                                        <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${user.isSpeaking ? 'text-green-400' : 'text-gray-600'}`}>
                                            {user.isSpeaking && <Mic className="w-3 h-3 animate-pulse" />}
                                            {user.isSpeaking ? 'Speaking...' : 'Connected'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Voice Controls Footer (Only if connected or always visible) */}
            <div className="bg-[#0b0b0b] p-4 border-t border-surfaceHighlight">
                {currentRoom ? (
                    <div className="rounded-xl bg-surfaceHighlight/20 p-3 border border-surfaceHighlight">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-green-500 font-bold text-green-500 uppercase">Connected</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">{currentRoom.name}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            {/* Mute Toggle */}
                            <button
                                onClick={toggleMute}
                                className={`p-2 rounded-lg flex-1 flex justify-center transition-colors ${localUser.isMuted ? 'bg-red-500/10 text-red-500' : 'bg-surface text-white hover:bg-surfaceHighlight'}`}
                            >
                                {localUser.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>

                            {/* Deafen Toggle */}
                            <button
                                onClick={toggleDeafen}
                                className={`p-2 rounded-lg flex-1 flex justify-center transition-colors ${localUser.isDeafened ? 'bg-red-500/10 text-red-500' : 'bg-surface text-white hover:bg-surfaceHighlight'}`}
                            >
                                {localUser.isDeafened ? <VolumeX className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                            </button>

                            {/* Disconnect */}
                            <button
                                onClick={leaveRoom}
                                className="p-2 rounded-lg flex-1 flex justify-center bg-surface text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4">
                        <p className="text-xs text-textMuted font-bold uppercase mb-2">Voice Disconnected</p>
                        <p className="text-[10px] text-gray-700">Join a channel to start talking</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomList;
