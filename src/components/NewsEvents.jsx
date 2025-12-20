import React from 'react';
import { Calendar, Tag, ArrowRight, Rss, Globe, Zap, ExternalLink } from 'lucide-react';

const NewsEvents = () => {
    const news = [
        {
            id: 1,
            title: 'India in WSF Squash World Cup final',
            date: 'Dec 14, 2025',
            image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=400',
            type: 'News',
            desc: 'India beat Egypt to reach the squash world cup final.',
            link: 'https://timesofindia.indiatimes.com/sports/more-sports/others/wsf-world-cup-india-beat-egypt-to-reach-squash-world-cup-final/articleshow/125958677.cms'
        },
        {
            id: 2,
            title: 'Sansad Khel Mahotsav polo match result',
            date: 'Dec 14, 2025',
            image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=400',
            type: 'News',
            desc: 'Kurukshetra beats Kaithal in a competitive polo fixture.',
            link: 'https://timesofindia.indiatimes.com/city/chandigarh/sansad-khel-mahotsav-kurukshetra-polo-team-beats-kaithal/articleshow/125952436.cms'
        },
        {
            id: 3,
            title: 'Indian cricket team 2025 international schedule',
            date: 'Dec 14, 2025',
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400',
            type: 'Event',
            desc: 'Upcoming tours and dates for the Indian cricket team.',
            link: 'https://www.olympics.com/en/news/indian-cricket-team-2025-calendar-schedule-dates'
        },
        {
            id: 4,
            title: 'Lionel Messi in India',
            date: 'Dec 14, 2025',
            image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400',
            type: 'Event',
            desc: 'Live updates from Kolkata & Hyderabad football event.',
            link: 'https://www.amarujala.com/live/sports/football/lionel-messi-in-india-live-updates-kolkata-hyderabad-messi-live-updates'
        }
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-end">
                <h2 className="section-title !mb-0">
                    <Rss className="icon" /> Intelligence Stream
                </h2>
                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Signals</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {news.map(item => (
                    <div key={item.id} className="premium-card p-0 group/news border-white/5 hover:border-primary/40 relative overflow-hidden transition-all flex flex-col h-full">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover grayscale opacity-60 group-hover/news:grayscale-0 group-hover/news:opacity-100 group-hover/news:scale-110 transition-all duration-[1000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            <span className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${item.type === 'Event' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/10 text-white border-white/20'
                                }`}>
                                <Zap size={10} className={item.type === 'Event' ? 'animate-pulse' : ''} />
                                {item.type}
                            </span>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-[8px] font-black text-textMuted uppercase tracking-widest mb-3">
                                <Calendar size={10} className="text-primary" /> {item.date}
                            </div>
                            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-tight mb-3 group-hover/news:text-primary transition-colors line-clamp-2">{item.title}</h3>
                            <p className="text-[11px] text-textMuted font-medium italic mb-6 line-clamp-2 leading-relaxed">"{item.desc}"</p>

                            <div className="mt-auto pt-4 border-t border-white/5">
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full flex items-center justify-between text-[9px] font-black uppercase tracking-widest transition-all p-2 rounded-lg group/link ${item.type === 'Event' ? 'text-primary' : 'text-textMuted hover:text-white'
                                        }`}
                                >
                                    {item.type === 'Event' ? 'Secure Terminal' : 'Full Infiltration'}
                                    <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                                </a>
                            </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-y-full group-hover/news:translate-y-0 transition-transform" />
                    </div>
                ))}
            </div>

            <button className="w-full btn-outline py-5 text-[10px] shadow-xl group/more relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-4">
                    ACCESS GLOBAL ARCHIVES <Globe size={16} className="group-hover/more:rotate-180 transition-transform duration-[1000ms]" />
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover/more:scale-x-100 transition-transform origin-left" />
            </button>
        </div>
    );
};

export default NewsEvents;
