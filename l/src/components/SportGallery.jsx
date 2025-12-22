import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Play, Users } from 'lucide-react';

const SportGallery = ({ sportName, channels, onChannelClick, getTierBadgeColor, formatViewers }) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = 300 * 2; // Increased for larger cards
        const newScroll = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;
        container.scrollTo({ left: newScroll, behavior: 'smooth' });
    };

    const updateScrollState = () => {
        const container = scrollRef.current;
        if (!container) return;
        setCanScrollLeft(container.scrollLeft > 10);
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };

    useEffect(() => {
        updateScrollState();
    }, [channels]);

    return (
        <div className="mb-8">
            {/* Header with arrows */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-white uppercase tracking-wide">{sportName}</h2>
                <div className="flex items-center gap-2">
                    {/* Arrow buttons */}
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all ${canScrollLeft
                            ? 'bg-surfaceHighlight border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary'
                            : 'bg-surface border-white/10 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all ${canScrollRight
                            ? 'bg-surfaceHighlight border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary'
                            : 'bg-surface border-white/10 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    {/* View All */}
                    <button className="text-xs text-textMuted hover:text-primary transition-colors flex items-center gap-1 font-bold uppercase ml-2">
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Gallery Container */}
            <div
                ref={scrollRef}
                onScroll={updateScrollState}
                className="flex gap-4 overflow-x-auto overflow-y-hidden"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {channels.map((channel, index) => (
                    <div
                        key={channel.id}
                        onClick={() => onChannelClick(channel)}
                        className="min-w-[280px] flex-shrink-0 cursor-pointer transition-all duration-200 group hover:-translate-y-1 hover:shadow-xl"
                    >
                        {/* Image Section Only - No background container */}
                        <div className="relative h-40 rounded-xl overflow-hidden">
                            <img
                                src={channel.thumbnail}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={channel.name}
                                style={{ objectPosition: 'center center' }}
                            />
                            {/* Badges on image */}
                            <div className="absolute top-2 left-2 flex gap-1">
                                <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">LIVE</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${getTierBadgeColor(channel.tier)}`}>
                                    {channel.tier}
                                </span>
                            </div>
                            {/* Viewers on image */}
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                <Users className="w-3 h-3" /> {formatViewers(channel.viewers)}
                            </div>
                            {/* Duration badge (like the reference) */}
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                <Play className="w-3 h-3 fill-white" />
                            </div>
                        </div>

                        {/* Text Section - Prominent and striking below image */}
                        <div className="pt-3 px-0.5">
                            <h4 className="font-black text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {channel.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{channel.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SportGallery;
