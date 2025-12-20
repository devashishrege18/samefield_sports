import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Crown, TrendingUp, Zap, Star, Shield, Activity, Cpu, Compass, Radio, Signal, Wifi } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'users'),
            orderBy('xp', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaders(list);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div className="premium-card p-24 text-center flex flex-col items-center justify-center min-h-[600px] bg-vanguard-black backdrop-blur-3xl border-white/5 shadow-[0_100px_200px_rgba(0,0,0,1)]">
            <div className="relative mb-16">
                <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
                <Activity className="w-32 h-32 text-primary animate-spin-slow opacity-20 relative z-10" />
                <Cpu className="absolute inset-0 m-auto w-12 h-12 text-primary animate-pulse relative z-20" />
            </div>
            <div className="space-y-4">
                <p className="text-[14px] text-primary font-black uppercase tracking-[0.8em] animate-pulse italic">DECRYPTING VANGUARD REGISTRY</p>
                <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.4em]">Node: 0xA7D_SYNC_V4</p>
            </div>
        </div>
    );

    return (
        <div className="premium-card overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,1)] group bg-vanguard-black backdrop-blur-3xl border-white/10 relative">
            {/* GLOBAL SCAN LINE */}
            <div className="absolute inset-x-0 h-[2px] bg-primary/40 animate-scan z-30 pointer-events-none opacity-40 top-0" />

            {/* AMBIENT GLOW */}
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="p-12 border-b border-white/10 bg-white/5 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all duration-[3000ms] pointer-events-none">
                    <Trophy size={240} className="text-primary" />
                </div>

                <div className="relative z-10 flex items-center gap-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center border border-primary/20 shadow-inner group/trophy">
                        <Trophy size={40} className="text-primary group-hover:scale-125 transition-transform" />
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <Signal className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.6em] italic">Sector-01 Prime Registry</span>
                        </div>
                        <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">
                            TACTICAL <span className="text-primary underline decoration-primary/20 decoration-[18px] underline-offset-[12px]">SUMMIT</span>
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 relative z-10">
                    <div className="px-6 py-2 bg-primary/10 rounded-full border border-primary/30 flex items-center gap-4 shadow-2xl">
                        <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest italic font-mono">NODE SYNC: ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/20">
                        <Wifi className="w-4 h-4" />
                        <span className="text-[9px] font-bold tracking-[0.4em] uppercase">Protocol: A7-D</span>
                    </div>
                </div>
            </div>

            <div className="p-8 xl:p-12 space-y-4 relative">
                {leaders.map((user, index) => (
                    <div
                        key={user.id}
                        className={`group/item flex items-center gap-8 p-8 rounded-[40px] transition-all duration-700 relative overflow-hidden animate-fade-in border ${index === 0
                            ? 'bg-primary/10 border-primary/40 shadow-[0_40px_80px_rgba(245,196,0,0.15)]'
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/5 hover:border-primary/20'
                            }`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        {/* ITEM SCAN LINE */}
                        <div className="absolute inset-x-0 h-[1.5px] bg-primary animate-scan pointer-events-none opacity-0 group-hover/item:opacity-40 transition-opacity" />

                        {/* Rank Ornament */}
                        <div className="w-20 flex justify-center items-center relative flex-shrink-0">
                            {index === 0 && (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/40 blur-2xl animate-pulse" />
                                    <Crown className="text-primary relative z-10 drop-shadow-[0_0_35px_rgba(245,196,0,1)]" size={48} />
                                </div>
                            )}
                            {index === 1 && <Medal className="text-gray-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" size={40} />}
                            {index === 2 && <Medal className="text-orange-500 drop-shadow-[0_0_20px_rgba(234,88,12,0.3)]" size={36} />}
                            {index > 2 && (
                                <span className="text-3xl font-black text-text-muted italic tabular-nums opacity-20 group-hover/item:opacity-100 group-hover/item:text-primary transition-all duration-700 font-mono">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                            )}
                        </div>

                        {/* Avatar Hub */}
                        <div className="relative flex-shrink-0 group/avatar">
                            <div className={`w-24 h-24 rounded-[32px] overflow-hidden border-2 transition-all duration-1000 shadow-2xl ${index === 0
                                ? 'border-primary ring-[14px] ring-primary/10'
                                : 'border-white/10 group-hover/item:border-primary/40 group-hover/item:scale-110'
                                }`}>
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    className="w-full h-full object-cover grayscale brightness-75 group-hover/avatar:grayscale-0 group-hover/avatar:brightness-100 transition-all duration-700"
                                    alt=""
                                />
                            </div>
                            {index === 0 && (
                                <div className="absolute -top-3 -right-3 bg-primary text-black p-2.5 rounded-2xl border-4 border-vanguard-black shadow-[0_15px_40px_rgba(245,196,0,0.6)] animate-bounce-in z-20">
                                    <Star size={18} fill="currentColor" className="animate-pulse" />
                                </div>
                            )}
                        </div>

                        {/* Identity & Stats */}
                        <div className="flex-1 min-w-0 space-y-4">
                            <div className="flex items-center gap-6">
                                <h4 className="text-4xl font-black text-white italic tracking-tighter truncate uppercase group-hover/item:text-primary transition-colors duration-500 leading-none drop-shadow-xl">{user.name}</h4>
                                {index < 3 && (
                                    <div className="flex items-center gap-3 bg-primary/10 px-4 py-1.5 rounded-xl border border-primary/20 backdrop-blur-3xl shadow-inner">
                                        <Shield size={16} className="text-primary animate-pulse" />
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">V-ELITE</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <Radio className="w-4 h-4 text-primary opacity-40" />
                                    <span className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] whitespace-nowrap italic">LVL {Math.floor(user.xp / 1000)} OPERATOR</span>
                                </div>
                                <div className="h-[3px] flex-1 bg-white/5 rounded-full overflow-hidden relative shadow-inner">
                                    <div
                                        className={`h-full transition-all duration-[3000ms] ease-out shadow-[0_0_20px_rgba(245,196,0,0.5)] ${index === 0 ? 'bg-primary' : 'bg-primary/40'}`}
                                        style={{ width: `${(user.xp % 1000) / 10}%` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan w-20" />
                                </div>
                            </div>
                        </div>

                        {/* XP Protocol */}
                        <div className="text-right flex flex-col items-end gap-3 flex-shrink-0 min-w-[180px]">
                            <div className="flex items-center justify-end gap-5 group-hover/item:scale-110 transition-transform duration-700">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Zap className={`w-6 h-6 animate-pulse ${index === 0 ? 'text-primary fill-primary' : 'text-primary'}`} />
                                </div>
                                <span className="text-5xl font-black text-white italic tracking-tighter tabular-nums leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover/item:text-primary transition-colors">{user.xp.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.5em] italic leading-none opacity-40 group-hover/item:opacity-80 transition-opacity">UNIT SYNC XP</p>
                        </div>
                    </div>
                ))}

                {leaders.length === 0 && (
                    <div className="p-40 text-center bg-white/[0.02] rounded-[80px] border-2 border-dashed border-white/5 flex flex-col items-center gap-12">
                        <div className="relative">
                            <Activity className="w-32 h-32 text-primary animate-spin-slow opacity-5" />
                            <Cpu className="absolute inset-0 m-auto w-12 h-12 text-primary opacity-20 animate-pulse" />
                        </div>
                        <p className="text-sm text-text-muted font-black uppercase tracking-[1em] italic leading-relaxed">NO ACTIVE VANGUARD SIGNALS <br /> DECRYPT PROTOCOL FAILED</p>
                    </div>
                )}
            </div>

            <div className="p-12 bg-white/5 border-t border-white/10 text-center relative overflow-hidden group/footer">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/footer:opacity-100 transition-opacity" />
                <button className="text-[12px] font-black text-primary hover:text-white uppercase tracking-[0.8em] transition-all flex items-center justify-center w-full group/btn italic relative z-10">
                    EXPAND GLOBAL COMMAND REGISTRY <Radio className="w-6 h-6 ml-8 group-hover:rotate-90 transition-transform animate-pulse" />
                </button>
            </div>

            <style>{`
                .animate-spin-slow {
                    animation: spin 15s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Leaderboard;
