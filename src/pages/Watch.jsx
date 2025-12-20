import React, { useState, useEffect, useRef } from 'react';
import { Play, MessageSquare, Share2, Heart, Send, Smile, ArrowUpRight, Trash2, Users, Info, Settings, Maximize, Activity, Mic, Volume2 } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import { liveStreamService } from '../services/LiveStreamService';
import { streamChatService } from '../services/StreamChatService';

const Watch = () => {
    const { addPoints } = usePoints();
    const [channels] = useState(liveStreamService.getChannels());
    const [currentChannel, setCurrentChannel] = useState(channels[0]);
    const [isLoading, setIsLoading] = useState(true);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [reactions, setReactions] = useState([]);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const handleNextStream = () => {
        setIsLoading(true);
        const next = liveStreamService.getWeightedStream(currentChannel.id);
        setCurrentChannel(next);
        streamChatService.init(next.id);
        setMessages([]);
        setTimeout(() => setIsLoading(false), 1500);
    };

    const handleChannelChange = (channel) => {
        setIsLoading(true);
        setCurrentChannel(channel);
        streamChatService.init(channel.id);
        setTimeout(() => setIsLoading(false), 1500);
    };

    useEffect(() => {
        streamChatService.init(currentChannel.id);
        setTimeout(() => setIsLoading(false), 1500);
        return () => streamChatService.leave();
    }, [currentChannel.id]);

    useEffect(() => {
        const unsubscribe = streamChatService.subscribe((type, payload) => {
            if (type === 'messages') {
                setMessages(payload || []);
                scrollToBottom();
            }
            if (type === 'reaction') {
                triggerReaction(payload);
            }
        });
        return unsubscribe;
    }, []);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const triggerReaction = (type) => {
        const id = Date.now() + Math.random();
        const startX = Math.random() * 80 + 10;
        setReactions(prev => [...prev, { id, type, x: startX }]);
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== id));
        }, 2000);
    };

    const handleSendReaction = (type) => {
        streamChatService.sendReaction(type);
        triggerReaction(type);
        addPoints(1, 'Reaction Sent');
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const username = localStorage.getItem('samefield_username') || 'You';
        streamChatService.sendMessage(newMessage, username);
        setNewMessage('');
        addPoints(10, 'Chat Contribution');
    };

    const handleDeleteMessage = async (messageId) => {
        await streamChatService.deleteMessage(messageId);
    };

    useEffect(() => {
        const interval = setInterval(() => addPoints(25, 'Watching Stream'), 60000);
        return () => clearInterval(interval);
    }, [addPoints]);

    return (
        <div className="h-[calc(100vh-100px)] overflow-hidden flex flex-col lg:flex-row p-6 md:p-10 gap-8 bg-black/95">
            {/* LEFT: CINEMATIC THEATER (MAIN) */}
            <div className="flex-1 flex flex-col gap-6 animate-fade-in min-w-0">
                <div className="flex-1 bg-black rounded-[32px] border border-white/5 overflow-hidden relative shadow-2xl group">
                    {/* VIDEO OVERLAYS */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-60 pointer-events-none z-20 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* LIVE BADGE */}
                    <div className="absolute top-8 left-8 z-30 flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-lg shadow-lg">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Live</span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/80 italic">
                            {currentChannel.type}
                        </div>
                    </div>

                    {/* VIEWER COUNT */}
                    <div className="absolute top-8 right-8 z-30 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80 italic">
                            <Users className="w-3 h-3" /> 24,105 Watching
                        </div>
                        <button onClick={handleNextStream} className="bg-white/10 p-2 rounded-lg text-white hover:bg-white hover:text-black transition-all">
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* LOADING STATE */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black">
                            <div className="flex flex-col items-center gap-6">
                                <Activity className="w-12 h-12 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-primary/60 tracking-[0.4em] italic">Loading Stream...</span>
                            </div>
                        </div>
                    )}

                    {/* VIDEO FRAME */}
                    <div className="w-full h-full relative z-10">
                        <iframe
                            className="w-full h-full object-cover"
                            src={`${currentChannel.url}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&custom_theme=dark`}
                            title="Live Stream"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* FLOATING REACTIONS */}
                    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                        {reactions.map(r => (
                            <div
                                key={r.id}
                                className="absolute bottom-20 text-4xl animate-float-up opacity-80"
                                style={{ left: `${r.x}%`, animationDuration: '2s' }}
                            >
                                {r.type === 'heart' ? '❤️' : r.type === 'fire' ? '🔥' : '💯'}
                            </div>
                        ))}
                    </div>

                    {/* BOTTOM CONTROLS */}
                    <div className="absolute bottom-0 inset-x-0 p-8 z-40 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <div className="flex items-center gap-4">
                            <button className="p-3 bg-white/10 hover:bg-white hover:text-black rounded-xl text-white transition-all"><Info className="w-5 h-5" /></button>
                            <div className="w-[1px] h-8 bg-white/20 mx-2" />
                            <div className="flex gap-2">
                                <button onClick={() => handleSendReaction('heart')} className="p-3 bg-white/10 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all text-xl">❤️</button>
                                <button onClick={() => handleSendReaction('fire')} className="p-3 bg-white/10 hover:bg-orange-500/20 hover:text-orange-500 rounded-xl transition-all text-xl">🔥</button>
                                <button onClick={() => handleSendReaction('100')} className="p-3 bg-white/10 hover:bg-green-500/20 hover:text-green-500 rounded-xl transition-all text-xl">💯</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-3 bg-white/10 hover:bg-white hover:text-black rounded-xl text-white transition-all"><Volume2 className="w-5 h-5" /></button>
                            <button className="p-3 bg-white/10 hover:bg-white hover:text-black rounded-xl text-white transition-all"><Settings className="w-5 h-5" /></button>
                            <button className="bg-primary px-6 py-3 rounded-xl text-black font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all italic">Go Premium</button>
                        </div>
                    </div>
                </div>

                {/* STREAM INFO */}
                <div className="p-8 flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-[32px]">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white font-black text-2xl border border-white/10 italic">
                            {currentChannel.name[0]}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{currentChannel.name}</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] italic">{currentChannel.description}</span>
                                <div className="h-1 w-1 bg-white/20 rounded-full" />
                                <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] italic">Official Stream</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-white/[0.05] border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"><Share2 className="w-4 h-4" /> Share</button>
                        <button className="bg-primary px-6 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-white transition-all italic"><Heart className="w-4 h-4 fill-current" /> Follow</button>
                    </div>
                </div>
            </div>

            {/* RIGHT: SIDEBAR (CHAT & LIST) */}
            <div className="w-full lg:w-[420px] flex flex-col gap-6 h-[600px] lg:h-auto shrink-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>

                {/* LIVE CHAT */}
                <div className="flex-1 flex flex-col bg-white/[0.02] overflow-hidden border border-white/5 rounded-[32px]">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Live Chat</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={chatContainerRef}>
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                                <MessageSquare size={40} className="text-white" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-center italic">Start the conversation</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col gap-1 ${msg.isSelf ? 'items-end' : 'items-start'} group/msg`}>
                                    {!msg.isSelf && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 italic">{msg.user}</span>
                                        </div>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed max-w-[90%] relative break-words ${msg.isSelf
                                        ? 'bg-primary text-black rounded-tr-sm'
                                        : 'bg-white/10 text-gray-200 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                        {msg.isSelf && (
                                            <button onClick={() => handleDeleteMessage(msg.id)} className="absolute -left-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-red-500 opacity-0 group-hover/msg:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-white/[0.02] border-t border-white/5">
                        <div className="relative group/form flex items-center gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Send a message..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 placeholder:italic"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/20 cursor-pointer hover:text-white/40 transition-colors">
                                    <Smile size={16} />
                                </div>
                            </div>
                            <button type="submit" className="p-3 bg-white/10 text-white rounded-xl hover:bg-primary hover:text-black transition-all active:scale-95 flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* UP NEXT */}
                <div className="h-[240px] flex flex-col bg-white/[0.02] overflow-hidden border border-white/5 rounded-[32px] shrink-0">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Trending Channels</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto flex items-center gap-4 px-6 scrollbar-hide">
                        {channels.filter(c => c.id !== currentChannel.id).map(channel => (
                            <div
                                key={channel.id}
                                onClick={() => handleChannelChange(channel)}
                                className="min-w-[160px] h-[140px] rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-primary/50 transition-all active:scale-95"
                            >
                                <img src={channel.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate italic mb-1">{channel.name}</h4>
                                    <p className="text-[9px] text-white/60 font-medium uppercase tracking-wider italic leading-none">Featured</p>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all duration-300">
                                    <Play className="w-8 h-8 text-white fill-current drop-shadow-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.8; }
                    100% { transform: translateY(-200px) scale(1.5) rotate(15deg); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Watch;
