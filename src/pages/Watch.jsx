import React, { useState, useEffect } from 'react';
import { Play, MessageSquare, Share2, Mic, Users, Heart, BarChart2, Video, Trophy, ShoppingBag, Zap, ArrowUpRight } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import { liveStreamService } from '../services/LiveStreamService';

const Watch = () => {
    const { addPoints } = usePoints();
    const [channels] = useState(liveStreamService.getChannels());
    const [currentChannel, setCurrentChannel] = useState(channels[0]);
    const [isLoading, setIsLoading] = useState(true);

    const handleChannelChange = (channel) => {
        setIsLoading(true);
        setCurrentChannel(channel);
        setTimeout(() => setIsLoading(false), 1500);
    };

    // Simulate "Watching Bonus"
    useEffect(() => {
        setIsLoading(false);
        const interval = setInterval(() => {
            addPoints(10, 'Watching Sports Bonus');
        }, 30000);

        return () => clearInterval(interval);
    }, [addPoints]);

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden gap-4 p-4">
            {/* Main Video Area - 75% Width */}
            <div className="flex-1 bg-black rounded-2xl border border-surfaceHighlight overflow-hidden relative shadow-2xl flex flex-col min-h-[250px] md:min-h-0">
                {/* Video Player */}
                <div className="relative flex-1 bg-black group">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs font-bold text-textMuted uppercase tracking-widest">Tuning In...</span>
                            </div>
                        </div>
                    )}

                    <iframe
                        className="w-full h-full object-cover"
                        src={`${currentChannel.url}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                        title="Live Stream"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* Overlay Info */}
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded flex items-center gap-2 animate-pulse shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full" /> Live
                            </span>
                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase rounded border border-white/10 shadow-lg">
                                {currentChannel.type}
                            </span>
                        </div>
                    </div>

                    {/* Controls Overlay (Mock) */}
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><Play className="w-5 h-5 fill-current" /></button>
                            <div className="h-1 w-24 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-red-500 rounded-full" />
                            </div>
                        </div>
                        <span className="text-white font-bold text-xs uppercase tracking-widest">Live</span>
                    </div>

                    {/* Next Match Info */}
                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 shadow-xl">
                            <p className="text-[10px] text-textMuted font-bold uppercase mb-0.5">Up Next</p>
                            <p className="text-xs text-white font-bold">Semi-Finals • Starts in 15m</p>
                        </div>
                    </div>
                </div>

                {/* Channel Info Bar */}
                <div className="h-16 bg-surface border-t border-surfaceHighlight flex items-center justify-between px-6">
                    <div>
                        <h2 className="text-white font-black text-lg uppercase tracking-wide">{currentChannel.name}</h2>
                        <p className="text-xs text-textMuted font-medium">
                            {currentChannel.isDemo ? (
                                <span className="text-primary italic">"Publicly available stream used for platform demonstration."</span>
                            ) : (
                                currentChannel.description
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-surfaceHighlight rounded-full text-white hover:bg-primary hover:text-black transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Side Channel List - 25% Width (or Scrollable on Mobile) */}
            <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-black uppercase tracking-wider text-sm">Live Channels</h3>
                    <span className="text-[10px] bg-primary text-black px-1.5 rounded font-bold">{channels.length}</span>
                </div>

                <div className="space-y-2">
                    {channels.map(channel => (
                        <div
                            key={channel.id}
                            onClick={() => handleChannelChange(channel)}
                            className={`
                                cursor-pointer group rounded-xl p-3 border transition-all duration-300 relative overflow-hidden
                                ${currentChannel.id === channel.id
                                    ? 'bg-gradient-to-r from-surfaceHighlight to-transparent border-primary shadow-[0_0_20px_-5px_theme(\'colors.primary/0.5\')] translate-x-2'
                                    : 'bg-black/40 border-transparent hover:border-surfaceHighlight hover:bg-surfaceHighlight/30'}
                            `}
                        >
                            {/* Background Image/Thumbnail Blur Effect */}
                            {currentChannel.id === channel.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent z-0 pointer-events-none" />
                            )}

                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className={`text-[10px] font-black uppercase tracking-wider py-1 px-2 rounded-md ${currentChannel.id === channel.id
                                    ? 'bg-primary text-black shadow-lg shadow-primary/50'
                                    : 'bg-white/10 text-gray-400 backdrop-blur-sm'
                                    }`}>
                                    {channel.type}
                                </span>
                                {currentChannel.id === channel.id && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600/20 rounded-full border border-red-500/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Live</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 items-center relative z-10">
                                <img
                                    src={channel.thumbnail}
                                    alt={channel.name}
                                    className={`w-12 h-12 rounded-lg object-cover border transition-colors ${currentChannel.id === channel.id ? 'border-primary' : 'border-white/10 group-hover:border-white/30'}`}
                                />
                                <div>
                                    <h4 className={`font-bold text-sm leading-tight mb-0.5 ${currentChannel.id === channel.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                        {channel.name}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 line-clamp-1 opacity-80">{channel.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Promo Box */}
                <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/5 border border-primary/20">
                    <p className="text-xs text-primary font-black uppercase mb-1">Premium Pass</p>
                    <p className="text-[10px] text-gray-300 mb-3">Unlock 4K streams and ad-free experience.</p>
                    <button className="w-full py-2 bg-primary text-black text-xs font-bold rounded uppercase hover:bg-white transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Watch;
