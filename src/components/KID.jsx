import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Activity, Star, Shield, Zap, Target, Cpu, Fingerprint, ChevronRight, Compass, Radio, UserCheck, Clock, ZapOff } from 'lucide-react';

const KID = () => {
    const userStats = {
        name: 'Alex Morgan',
        id: 'SF-B821-V4',
        points: 2450,
        rank: 12,
        grade: 'Vanguard Elite',
        attributes: {
            speed: 92,
            stamina: 88,
            technique: 85,
            power: 78
        }
    };

    const leaderboard = [
        { rank: 1, name: 'Priya Sharma', points: 3100, trend: 'up', class: 'Striker' },
        { rank: 2, name: 'Jordan Lee', points: 3050, trend: 'same', class: 'Tactician' },
        { rank: 3, name: 'Casey Smith', points: 2980, trend: 'down', class: 'Scout' },
        { rank: 4, name: 'Aisha Khan', points: 2900, trend: 'up', class: 'Vanguard' },
        { rank: 5, name: 'Maria Gonzalez', points: 2850, trend: 'up', class: 'Sentinel' },
    ];

    return (
        <div className="h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide p-12 md:p-16 lg:p-24 space-y-24 bg-black/40 backdrop-blur-3xl rounded-[60px] border border-white/5 animate-fade-in relative">
            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full animate-pulse-glow" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="animate-fade-in">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-12 h-[1px] bg-primary/40" />
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.6em] italic animate-pulse">Identity Protocol</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.85]">
                        Bio-Metric <span className="text-primary underline decoration-primary/40 decoration-[25px] underline-offset-[25px]">Console</span>
                    </h1>
                    <p className="text-lg text-textMuted font-black uppercase tracking-[0.4em] mt-10 flex items-center gap-6 italic opacity-80">
                        <Fingerprint className="w-8 h-8 text-primary" /> Verified Talent Identification & Performance Registry
                    </p>
                </div>
                <div className="px-10 py-6 bg-white/5 border border-white/10 rounded-[40px] flex items-center gap-6 group hover:border-primary/40 transition-all cursor-crosshair backdrop-blur-2xl shadow-2xl">
                    <div className="w-4 h-4 bg-primary rounded-full animate-ping shadow-[0_0_20px_var(--primary-glow)]" />
                    <div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic block mb-1">Terminal Status</span>
                        <span className="text-2xl font-black text-primary uppercase tracking-tighter italic">Vanguard Sync Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Player ID Card - Holographic Design */}
                <div className="lg:col-span-5">
                    <div className="premium-card p-0 overflow-hidden relative group/card shadow-[0_60px_150px_rgba(0,0,0,1)] bg-black/40 border-white/10">
                        {/* MODAL SCAN LINE */}
                        <div className="absolute inset-x-0 h-[2px] bg-primary/30 animate-scan z-30 pointer-events-none opacity-40 top-0" />

                        {/* Holographic Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-[2000ms]" />
                        <div className="absolute top-0 right-0 p-16 opacity-5 -rotate-12 group-hover/card:rotate-0 transition-transform duration-[2000ms] pointer-events-none"><Shield size={350} className="text-primary" /></div>

                        <div className="p-12 bg-white/5 border-b border-white/10 relative z-10">
                            <div className="flex justify-between items-start mb-14">
                                <div className="w-24 h-16 bg-primary rounded-2xl flex flex-col justify-around p-3 shadow-[0_0_40px_rgba(245,196,0,0.5)] group-hover/card:shadow-[0_0_60px_rgba(245,196,0,0.8)] transition-all">
                                    <div className="w-full h-1 bg-black/30 rounded-full" />
                                    <div className="w-full h-1 bg-black/30 rounded-full" />
                                    <div className="w-full h-1 bg-black/30 rounded-full" />
                                </div>
                                <div className="text-6xl font-black text-primary italic tracking-tighter drop-shadow-[0_0_20px_rgba(245,196,0,0.4)]">SF-X</div>
                            </div>

                            <div className="flex gap-10 items-center">
                                <div className="relative">
                                    <div className="w-44 h-44 rounded-[48px] bg-black border-4 border-white/10 group-hover/card:border-primary transition-all duration-700 overflow-hidden flex items-center justify-center relative shadow-2xl">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userStats.name}`} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[2000ms]" />
                                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-primary text-black p-3 rounded-2xl border-4 border-black shadow-[0_15px_40px_rgba(245,196,0,0.6)] animate-bounce-in">
                                        <Shield size={24} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="min-w-0 space-y-4">
                                    <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none truncate group-hover/card:text-primary transition-colors duration-500">{userStats.name}</h3>
                                    <div className="flex items-center gap-4">
                                        <p className="text-lg font-black text-primary tracking-[0.5em] font-mono italic leading-none">{userStats.id}</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                                        <UserCheck size={18} className="text-primary" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic">{userStats.grade} Rank</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 space-y-12 relative z-10">
                            <div className="grid grid-cols-2 gap-8">
                                {Object.entries(userStats.attributes).map(([key, val], i) => (
                                    <div key={key} className="bg-white/5 border border-white/5 p-8 rounded-[32px] group/stat hover:border-primary/40 transition-all duration-500 flex justify-between items-end relative overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                        {/* STAT SCAN LINE */}
                                        <div className="absolute inset-x-0 h-[1px] bg-primary/10 animate-scan pointer-events-none opacity-0 group-hover/stat:opacity-100" />

                                        <div className="space-y-4">
                                            <p className="text-[11px] font-black text-textMuted uppercase tracking-[0.5em] mb-1 group-hover/stat:text-primary transition-colors italic">{key}</p>
                                            <div className="h-2 w-24 bg-primary/10 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-primary shadow-[0_0_20px_var(--primary-glow)] animate-pulse" style={{ width: `${val}%` }} />
                                            </div>
                                        </div>
                                        <span className="text-4xl font-black text-white italic tabular-nums leading-none tracking-tighter group-hover/stat:scale-110 transition-transform">{val}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-primary p-12 rounded-[48px] flex justify-between items-center shadow-[0_40px_100px_rgba(245,196,0,0.3)] group/points hover:scale-[1.03] transition-all duration-700 relative overflow-hidden underline decoration-transparent hover:decoration-black/20 decoration-4 underline-offset-8">
                                <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12 group-hover/points:rotate-0 transition-transform duration-1000"><Zap size={200} fill="black" /></div>
                                <div className="relative z-10">
                                    <p className="text-[12px] font-black text-black/60 uppercase tracking-[0.5em] mb-3 italic">Total Performance XP</p>
                                    <p className="text-black font-black uppercase text-2xl italic tracking-tighter leading-none">Operational Data Verified</p>
                                </div>
                                <div className="text-right relative z-10">
                                    <span className="text-7xl font-black text-black italic leading-none tracking-tighter tabular-nums drop-shadow-2xl">{userStats.points.toLocaleString()}</span>
                                    <Zap size={32} fill="black" className="ml-4 inline-block -translate-y-2 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics & Global Sync */}
                <div className="lg:col-span-7 flex flex-col gap-12">
                    <div className="premium-card p-12 flex flex-col h-full relative overflow-hidden group/analytics bg-black/40 border-white/5 shadow-2xl">
                        {/* LARGE BACKGROUND LOGO */}
                        <div className="absolute -left-20 -bottom-20 text-white/5 rotate-12 pointer-events-none group-hover/analytics:rotate-0 transition-transform duration-[3000ms]"><Cpu size={400} /></div>

                        <div className="flex justify-between items-center mb-14 relative z-10">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_red]" />
                                    <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.5em] italic">Live Intelligence Stream</span>
                                </div>
                                <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Global <span className="text-primary italic underline decoration-primary/40 decoration-[15px] underline-offset-[10px]">Sync</span></h3>
                                <p className="text-lg text-textMuted font-black uppercase tracking-[0.4em] mt-8 italic opacity-60 flex items-center gap-4">
                                    <Target className="w-6 h-6 text-primary" /> Sector Identification Protocol active
                                </p>
                            </div>
                            <button className="bg-white/5 hover:bg-white text-white hover:text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-[32px] border border-white/10 transition-all shadow-2xl italic underline decoration-2 underline-offset-4">Advanced Analytics</button>
                        </div>

                        <div className="flex-1 space-y-6 relative z-10">
                            <div className="grid grid-cols-12 px-10 py-6 text-[10px] font-black text-textMuted uppercase tracking-[0.5em] border-b border-white/10 italic">
                                <div className="col-span-1">RANK</div>
                                <div className="col-span-1"></div>
                                <div className="col-span-5">UNIT IDENTIFIER</div>
                                <div className="col-span-3 text-center">PROTOCOL</div>
                                <div className="col-span-2 text-right">XP DELTA</div>
                            </div>

                            <div className="space-y-4 overflow-y-auto max-h-[500px] scrollbar-hide pr-4">
                                {leaderboard.map((item, i) => (
                                    <div key={item.rank} className="grid grid-cols-12 px-10 py-7 bg-black/60 border border-white/5 rounded-[40px] items-center hover:bg-white/5 hover:border-primary/40 transition-all duration-500 group/row cursor-pointer relative overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 0.12}s` }}>
                                        {/* ROW SCAN LINE */}
                                        <div className="absolute inset-x-0 h-[1px] bg-primary/20 animate-scan pointer-events-none opacity-0 group-hover/row:opacity-100" />

                                        <div className="col-span-1 flex items-center justify-center">
                                            <span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-2xl border transition-all duration-500 ${item.rank === 1 ? 'bg-primary text-black border-transparent shadow-[0_10px_30px_rgba(245,196,0,0.4)]' :
                                                item.rank === 2 ? 'bg-gray-400 text-black border-transparent' :
                                                    item.rank === 3 ? 'bg-orange-600/70 text-black border-transparent' :
                                                        'bg-black/40 text-textMuted border-white/10 group-hover/row:border-primary/40 group-hover/row:text-primary'
                                                }`}>
                                                {item.rank.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div className="col-span-1"></div>
                                        <div className="col-span-5 flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-white/10 group-hover/row:border-primary/60 transition-all duration-500 shadow-xl">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} className="w-full h-full object-cover group-hover/row:scale-110 transition-transform" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-2xl font-black text-white italic truncate uppercase group-hover/row:text-primary transition-colors block leading-none mb-2">{item.name}</span>
                                                <span className="text-[9px] text-textMuted font-black uppercase tracking-widest italic opacity-60">Authentication SF-TX-{100 + i}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <span className="text-[10px] font-black text-textMuted uppercase tracking-[0.4em] group-hover/row:text-white transition-colors italic bg-white/5 px-4 py-1.5 rounded-full border border-white/10">{item.class}</span>
                                        </div>
                                        <div className="col-span-2 text-right flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl font-black text-white italic tabular-nums leading-none tracking-tighter group-hover/row:text-primary transition-colors">{item.points.toLocaleString()}</span>
                                                <div className={`${item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-primary'} group-hover/row:scale-125 transition-transform animate-pulse`}>
                                                    {item.trend === 'up' ? <TrendingUp size={22} /> :
                                                        item.trend === 'down' ? <TrendingUp size={22} style={{ transform: 'scaleY(-1)' }} /> :
                                                            <Activity size={22} />}
                                                </div>
                                            </div>
                                            <span className="text-[8px] text-textMuted font-black uppercase tracking-widest italic">REAL-TIME SYNC</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/5 flex justify-center relative z-10">
                            <button className="text-[11px] font-black text-textMuted hover:text-white uppercase tracking-[0.6em] transition-all flex items-center gap-6 group/more italic underline decoration-transparent hover:decoration-primary/40 decoration-2 underline-offset-8">
                                <Radio className="w-5 h-5 text-primary animate-pulse" /> Expand Complete Sector Registry <ChevronRight className="w-6 h-6 group-hover/more:translate-x-3 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
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

export default KID;
