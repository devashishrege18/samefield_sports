import React from 'react';
import { Video, Calendar, Star, Shield, Zap, Target, ChevronRight } from 'lucide-react';

const PlayerMeet = () => {
    const players = [
        { id: 1, name: 'Zara Williams', sport: 'Football', role: 'Elite Striker', status: 'Available', rating: 4.9, image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=400' },
        { id: 2, name: 'Elena Rodriguez', sport: 'Tennis', role: 'Grand Slam Pro', status: 'Booked', rating: 5.0, image: 'https://images.unsplash.com/photo-1595435064215-68d148202528?auto=format&fit=crop&q=80&w=400' },
        { id: 3, name: 'Sam Chen', sport: 'Basketball', role: 'All-Star Guard', status: 'Available', rating: 4.8, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-end">
                <h2 className="section-title !mb-0">
                    <Shield className="icon" /> Sector Heroes
                </h2>
                <button className="text-[10px] font-black text-textMuted hover:text-primary uppercase tracking-[0.4em] transition-all flex items-center gap-4 group/all">
                    Global Registry <ChevronRight className="w-4 h-4 group-hover/all:translate-x-2 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {players.map(player => (
                    <div key={player.id} className="premium-card p-0 group/player border-white/5 hover:border-primary/40 relative overflow-hidden transition-all hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

                        <div className="h-[280px] w-full overflow-hidden relative">
                            <img
                                src={player.image}
                                className="w-full h-full object-cover grayscale group-hover/player:grayscale-0 group-hover/player:scale-110 transition-all duration-[1500ms]"
                                alt={player.name}
                            />
                            <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{player.sport}</span>
                            </div>
                            <div className="absolute top-6 right-6 z-20">
                                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                                    <Star size={12} fill="var(--primary)" className="text-primary" />
                                    <span className="text-[10px] font-black text-white tabular-nums">{player.rating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 relative z-20">
                            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none mb-2 group-hover/player:text-primary transition-colors">{player.name}</h3>
                            <p className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-8 italic flex items-center gap-3">
                                <Zap size={14} className="text-primary/60" /> {player.role}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="btn-primary py-3 text-[9px] flex items-center justify-center gap-3 shadow-2xl active:scale-95">
                                    <Calendar size={14} /> Schedule
                                </button>
                                <button className="btn-outline py-3 text-[9px] flex items-center justify-center gap-3 active:scale-95">
                                    <Video size={14} /> Intel
                                </button>
                            </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerMeet;
