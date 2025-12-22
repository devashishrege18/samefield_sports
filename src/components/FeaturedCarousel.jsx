import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedCarousel = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const events = [
        { id: 1, title: 'Super Six Finals', type: 'Mixed Doubles', img: '/assets/thumb_womens_football_1765784471060.png', tag: "Women's Sport" },
        { id: 2, title: 'Slamball Semis', type: 'Extreme Sports', img: '/assets/thumb_redbull_extreme_1765784514775.png' },
        { id: 3, title: 'Pro Surf League', type: 'World Tour', img: '/assets/thumb_surfing_wsl_1765784559697.png' },
        { id: 4, title: 'WNBA All-Stars', type: 'Exhibition', img: '/assets/thumb_wnba_basketball_1765784493211.png', tag: "Women's Sport" },
        { id: 5, title: 'Champions Trophy', type: 'Cricket Final', img: '/assets/thumb_cricket.png', tag: "International" },
        { id: 6, title: 'NBA Finals', type: 'Basketball', img: '/assets/thumb_basketball.png' }
    ];

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = 300;
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

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" /> Featured Events
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${canScrollLeft
                            ? 'bg-surfaceHighlight border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary'
                            : 'bg-surface border-white/10 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${canScrollRight
                            ? 'bg-surfaceHighlight border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary'
                            : 'bg-surface border-white/10 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                onScroll={updateScrollState}
                className="flex gap-4 overflow-x-auto overflow-y-hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
                {events.map((ev) => (
                    <div
                        key={ev.id}
                        onClick={() => navigate('/watch')}
                        className="min-w-[280px] h-40 flex-shrink-0 rounded-xl bg-surface border border-surfaceHighlight p-4 flex flex-col justify-between hover:border-primary transition-colors cursor-pointer relative overflow-hidden group"
                    >
                        <div className="absolute inset-0">
                            <img src={ev.img} alt="Event" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Aug 24 • 14:00 GMT</span>
                            {ev.tag && (
                                <span className="text-[9px] font-medium text-white/60 bg-white/10 px-1.5 py-0.5 rounded">{ev.tag}</span>
                            )}
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-white text-lg leading-tight mb-1">{ev.title}</h4>
                            <p className="text-xs text-gray-300">{ev.type} • Match {ev.id}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCarousel;
