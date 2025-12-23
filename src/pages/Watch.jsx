import React, { useState, useEffect, useRef } from 'react';
import { Play, MessageSquare, Send, Smile, ArrowUpRight, Trash2, Users, ChevronRight, ChevronLeft, Video, ArrowRight, X, Maximize2, Minimize2, MessageCircle } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import { liveStreamService } from '../services/LiveStreamService';
import { streamChatService } from '../services/StreamChatService';
import SportGallery from '../components/SportGallery';

const Watch = () => {
    const { addPoints } = usePoints();
    const [channels] = useState(liveStreamService.getChannels());
    const [currentChannel, setCurrentChannel] = useState(channels[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedSport, setSelectedSport] = useState('all');
    const [showChat, setShowChat] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const playerContainerRef = useRef(null);

    // Chat State
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [reactions, setReactions] = useState([]);
    const [showEmojis, setShowEmojis] = useState(false);
    const messagesEndRef = useRef(null);

    const sports = liveStreamService.getSports();
    const allGroupedChannels = liveStreamService.getChannelsGroupedBySport();

    const groupedChannels = selectedSport === 'all'
        ? allGroupedChannels
        : Object.fromEntries(
            Object.entries(allGroupedChannels).filter(([sportName]) =>
                sportName.toLowerCase().includes(selectedSport.toLowerCase())
            )
        );

    const handleChannelClick = (channel) => {
        setIsLoading(true);
        setCurrentChannel(channel);
        setShowPlayer(true);
        streamChatService.init(channel.id);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleNextStream = () => {
        setIsLoading(true);
        const next = liveStreamService.getWeightedStream(currentChannel.id);
        setCurrentChannel(next);
        streamChatService.init(next.id);
        setMessages([]);
        setTimeout(() => setIsLoading(false), 1500);
    };

    const handleClosePlayer = () => {
        setShowPlayer(false);
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsFullscreen(false);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        streamChatService.init(currentChannel?.id || 'default');
        setTimeout(() => setIsLoading(false), 1500);
        return () => streamChatService.leave();
    }, []);

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

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
        addPoints(2, 'Chat Message');
    };

    const handleDeleteMessage = async (messageId) => {
        await streamChatService.deleteMessage(messageId);
    };

    useEffect(() => {
        const interval = setInterval(() => addPoints(10, 'Watching Sports Bonus'), 30000);
        return () => clearInterval(interval);
    }, [addPoints]);

    const formatViewers = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    const getTierBadgeColor = (tier) => {
        if (tier === 'local') return 'bg-green-500/20 text-green-400 border-green-500/30';
        if (tier === 'national') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        if (tier === 'international') return 'bg-primary/20 text-primary border-primary/30';
        return 'bg-white/10 text-white border-white/20';
    };

    const emojis = ['❤️', '🔥', '💯', '👏', '⚽', '🏏', '🏀', '🎉', '💪', '🙌'];

    // FULLSCREEN OVERLAY PLAYER (Twitch Style)
    if (showPlayer) {
        return (
            <div
                ref={playerContainerRef}
                className="fixed inset-0 z-[100] bg-black flex"
            >
                {/* VIDEO SECTION */}
                <div className={`flex-1 relative flex flex-col ${showChat ? '' : 'w-full'}`}>
                    {/* Top Controls Bar */}
                    <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded flex items-center gap-2 animate-pulse">
                                <span className="w-2 h-2 bg-white rounded-full" /> LIVE
                            </span>
                            <span className="text-white font-bold text-lg">{currentChannel?.name}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getTierBadgeColor(currentChannel?.tier)}`}>
                                {currentChannel?.tier}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-white text-sm mr-4">
                                <Users className="w-4 h-4 text-red-500" />
                                <span className="font-bold">{formatViewers(currentChannel?.viewers)}</span>
                            </div>
                            <button
                                onClick={handleNextStream}
                                className="px-3 py-1.5 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-all flex items-center gap-1"
                            >
                                Next <ArrowUpRight className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className={`p-2 rounded transition-all ${showChat ? 'bg-primary text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                title={showChat ? 'Hide Chat' : 'Show Chat'}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-all"
                                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleClosePlayer}
                                className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-all"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Floating Reactions */}
                    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                        {reactions.map(r => (
                            <div
                                key={r.id}
                                className="absolute bottom-20 text-5xl animate-float-up opacity-0"
                                style={{ left: `${r.x}%`, animationDuration: '2s' }}
                            >
                                {r.type === 'heart' ? '❤️' : r.type === 'fire' ? '🔥' : '💯'}
                            </div>
                        ))}
                    </div>

                    {/* Video Player */}
                    <div className="flex-1 relative">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Loading Stream...</span>
                                </div>
                            </div>
                        )}
                        <iframe
                            className="w-full h-full"
                            src={`${currentChannel?.url}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                            title="Live Stream"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                        />
                    </div>

                    {/* Bottom Reaction Bar */}
                    <div className="h-16 bg-[#18181b] border-t border-white/10 flex items-center justify-between px-6">
                        <div>
                            <p className="text-white/60 text-xs">{currentChannel?.description}</p>
                            <p className="text-white/40 text-[10px]">{currentChannel?.sport}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleSendReaction('heart')} className="p-3 bg-white/5 rounded-lg hover:bg-red-500/20 hover:scale-110 transition-all text-xl">❤️</button>
                            <button onClick={() => handleSendReaction('fire')} className="p-3 bg-white/5 rounded-lg hover:bg-orange-500/20 hover:scale-110 transition-all text-xl">🔥</button>
                            <button onClick={() => handleSendReaction('100')} className="p-3 bg-white/5 rounded-lg hover:bg-green-500/20 hover:scale-110 transition-all text-xl">💯</button>
                        </div>
                    </div>
                </div>

                {/* CHAT SECTION - Twitch Style */}
                {showChat && (
                    <div className="w-[340px] bg-[#18181b] border-l border-white/10 flex flex-col">
                        {/* Chat Header */}
                        <div className="h-14 border-b border-white/10 flex items-center justify-between px-4">
                            <span className="text-white font-bold text-sm uppercase tracking-wider">Stream Chat</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-white/40 text-xs">{messages.length}</span>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            {messages.length === 0 && (
                                <div className="text-center py-8">
                                    <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-2" />
                                    <p className="text-white/40 text-sm">Welcome to the chat!</p>
                                    <p className="text-white/30 text-xs">Say something to get started</p>
                                </div>
                            )}
                            {messages.map((msg, idx) => {
                                const avatarColor = msg.isSelf ? 'bg-primary text-black' : idx % 4 === 0 ? 'bg-blue-500' : idx % 4 === 1 ? 'bg-green-500' : idx % 4 === 2 ? 'bg-pink-500' : 'bg-purple-500';
                                const nameColor = msg.isSelf ? 'text-primary' : idx % 4 === 0 ? 'text-blue-400' : idx % 4 === 1 ? 'text-green-400' : idx % 4 === 2 ? 'text-pink-400' : 'text-purple-400';
                                return (
                                    <div key={msg.id} className="flex items-start gap-2 py-1.5 px-2 hover:bg-white/5 rounded transition-colors group">
                                        {/* Avatar */}
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor}`}>
                                            {msg.user?.charAt(0)?.toUpperCase() || 'F'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`font-bold text-sm ${nameColor}`}>
                                                {msg.user}
                                            </span>
                                            <span className="text-white/40 mx-1">:</span>
                                            <span className="text-white/90 text-sm break-words">{msg.text}</span>
                                        </div>
                                        {msg.isSelf && (
                                            <button onClick={() => handleDeleteMessage(msg.id)} className="p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Emoji Picker */}
                        {showEmojis && (
                            <div className="p-2 bg-[#0e0e10] border-t border-white/10 flex flex-wrap gap-1">
                                {emojis.map(emoji => (
                                    <button key={emoji} onClick={() => { setNewMessage(prev => prev + emoji); setShowEmojis(false); }} className="p-2 hover:bg-white/10 rounded transition-colors text-lg">
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Chat input - seamless grey like YouTube */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-[#3f3f3f]">
                            <div className="flex items-center bg-[#3f3f3f] rounded-full">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Chat..."
                                    className="chat-input flex-1 bg-[#3f3f3f] border-none text-sm text-white placeholder:text-white/50 py-2.5 pl-5 pr-2 rounded-l-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowEmojis(!showEmojis)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10 focus:outline-none mr-2"
                                >
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <style>{`
                    @keyframes float-up {
                        0% { transform: translateY(0) scale(1); opacity: 1; }
                        100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
                    }
                    .animate-float-up {
                        animation: float-up 2s ease-out forwards;
                    }
                    .chat-input,
                    .chat-input:focus,
                    .chat-input:focus-visible,
                    .chat-input:active {
                        outline: none !important;
                        box-shadow: none !important;
                        border: none !important;
                        --tw-ring-color: transparent !important;
                        --tw-ring-shadow: none !important;
                        -webkit-appearance: none;
                    }
                `}</style>
            </div>
        );
    }

    // GALLERY VIEW (when no video is playing)
    return (
        <div className="min-h-screen overflow-y-auto pb-24">

            {/* JIOHOTSTAR STYLE HERO BANNER */}
            <div className="relative h-[320px] md:h-[380px] rounded-2xl overflow-hidden mb-6">
                {/* Background Athlete Poster - Positioned to show athletes on right */}
                <img
                    src="/assets/watch_hero.png"
                    alt="Athletes"
                    className="absolute inset-0 w-full h-full object-cover object-right"
                />
                {/* Lighter Gradient - Shows More Image */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

                {/* Content - Compact Left Section like JioHotstar */}
                <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 pb-6 md:pb-10 max-w-lg">

                    {/* Main Heading - Stylized */}
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                        <span className="relative inline-block">
                            Every Sport
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary to-yellow-400 rounded-full" />
                        </span>
                        <br />
                        <span className="text-primary">Every Level</span>
                    </h1>

                    {/* Newly Added / Status Tag */}
                    <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">
                        ● Live Now
                    </div>

                    {/* Meta Info Row */}
                    <div className="text-white/70 text-xs font-medium mb-3">
                        2024 • {channels.length} Streams • All Sports
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                        From local leagues to the Olympics — discover athletes at every stage.
                    </p>

                    {/* Category Tags */}
                    <div className="flex items-center gap-2 text-white/60 text-xs font-bold mb-5">
                        <span>Cricket</span>
                        <span className="text-white/30">|</span>
                        <span>Football</span>
                        <span className="text-white/30">|</span>
                        <span>Basketball</span>
                        <span className="text-white/30">|</span>
                        <span>+5 more</span>
                    </div>

                    {/* CTA Buttons - Gradient Style */}
                    <div className="flex items-center gap-3">
                        <button className="px-8 py-3 bg-gradient-to-r from-primary to-yellow-400 text-black font-black uppercase text-sm rounded-sm hover:opacity-90 transition-all flex items-center gap-2">
                            <Play className="w-4 h-4 fill-black" /> Watch Now
                        </button>
                        <button className="w-10 h-10 bg-white/10 backdrop-blur-sm text-white rounded-sm border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center">
                            <span className="text-lg">+</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* SPORT CATEGORY TABS - Aligned with gallery headings */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {sports.map(sport => (
                    <button
                        key={sport.id}
                        onClick={() => setSelectedSport(sport.id)}
                        className={`px-4 py-2 text-sm font-bold uppercase whitespace-nowrap transition-all relative ${selectedSport === sport.id
                            ? 'text-primary'
                            : 'text-textMuted hover:text-white'
                            }`}
                    >
                        {sport.name}
                        {selectedSport === sport.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* SPORT GALLERIES */}
            {Object.entries(groupedChannels).map(([sportName, sportChannels]) => (
                <SportGallery
                    key={sportName}
                    sportName={sportName}
                    channels={sportChannels}
                    onChannelClick={handleChannelClick}
                    getTierBadgeColor={getTierBadgeColor}
                    formatViewers={formatViewers}
                />
            ))}

            {/* GO LIVE CTA */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-black via-surface to-red-900/20 border border-surfaceHighlight p-8 md:p-12 text-center">
                <div className="inline-block p-4 bg-primary rounded-full mb-4">
                    <Video className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-2 tracking-tight">Stream Your Event</h3>
                <p className="text-textMuted max-w-lg mx-auto mb-6">
                    Whether it's a school cricket match or a local football tournament — share it with the world.{' '}
                    <span className="text-primary font-bold">From grassroots to glory.</span>
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button className="px-8 py-3 bg-primary text-black font-black uppercase rounded-full hover:bg-white transition-colors flex items-center gap-2 text-sm">
                        <ArrowRight className="w-4 h-4" /> Apply to Go Live
                    </button>
                    <span className="text-textMuted text-xs">Use OBS/Streamlabs → YouTube Live → Share link with SameField</span>
                </div>
            </div>
        </div>
    );
};

export default Watch;
