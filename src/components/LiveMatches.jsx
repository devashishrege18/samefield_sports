import React, { useState, useEffect } from 'react';
import { Activity, Star, Info, ChevronRight, Zap } from 'lucide-react';

const LiveMatches = () => {
    // Mock data for local matches
    const matches = [
        { id: 1, teamA: 'City Strikers', teamB: 'Valley Vipers', scoreA: 2, scoreB: 1, time: '65:00', status: 'LIVE', possession: 60, iconA: '⚔️', iconB: '🐍' },
        { id: 2, teamA: 'North High', teamB: 'South Uni', scoreA: 0, scoreB: 0, time: '12:00', status: 'LIVE', possession: 45, iconA: '🦅', iconB: '🦁' },
        { id: 3, teamA: 'Golden Eagles', teamB: 'Black Panthers', scoreA: 3, scoreB: 2, time: 'FT', status: 'FINISHED', possession: 50, iconA: '⚜️', iconB: '🐾' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-end">
                <h2 className="section-title !mb-0">
                    <Activity className="icon" /> Field Radar Live
                </h2>
                <div className="flex items-center gap-4 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary-glow)]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Sync Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map(match => (
                    <div key={match.id} className="premium-card p-0 group/match border-white/5 hover:border-primary/40 relative overflow-hidden transition-all hover:scale-[1.02]">
                        {/* Match Status Header */}
                        <div className="bg-white/5 border-b border-white/5 p-6 flex justify-between items-center relative z-10">
                            <span className={`flex items-center gap-3 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${match.status === 'LIVE' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-textMuted border-white/10'
                                }`}>
                                {match.status === 'LIVE' && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />}
                                {match.time} {match.status}
                            </span>
                            <button className="text-textMuted hover:text-white transition-colors">
                                <Info size={16} />
                            </button>
                        </div>

                        {/* Scoreboard Area */}
                        <div className="p-10 flex flex-col items-center gap-8 relative z-10 bg-gradient-to-br from-white/[0.02] to-transparent">
                            <div className="flex items-center justify-between w-full gap-4">
                                <div className="flex flex-col items-center gap-4 flex-1 group/team">
                                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl shadow-xl group-hover/team:border-primary/50 transition-all group-hover/team:scale-110">
                                        {match.iconA}
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest text-center italic">{match.teamA}</span>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-5xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-lg">{match.scoreA}</span>
                                        <div className="h-6 w-[2px] bg-white/10 rotate-12" />
                                        <span className="text-5xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-lg">{match.scoreB}</span>
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                        <Star size={12} className="text-primary/40" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4 flex-1 group/team">
                                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl shadow-xl group-hover/team:border-primary/50 transition-all group-hover/team:scale-110">
                                        {match.iconB}
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest text-center italic">{match.teamB}</span>
                                </div>
                            </div>

                            {/* Live Stats Module */}
                            {match.status === 'LIVE' && (
                                <div className="w-full space-y-3 bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center text-[9px] font-black text-textMuted uppercase tracking-widest">
                                        <span>Field Possession</span>
                                        <span className="text-primary italic tabular-nums">{match.possession}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner flex">
                                        <div className="h-full bg-primary shadow-[0_0_10px_var(--primary-glow)] transition-all duration-1000" style={{ width: `${match.possession}%` }} />
                                        <div className="h-full bg-white/10 flex-1" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Protocol */}
                        <div className="p-6 border-t border-white/5 relative z-10 flex justify-center">
                            <button className="text-[10px] font-black text-textMuted hover:text-primary uppercase tracking-[0.4em] transition-all flex items-center gap-4 group/more">
                                Intel Details <ChevronRight className="w-4 h-4 group-hover/more:translate-x-2 transition-transform" />
                            </button>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-y-full group-hover/match:translate-y-0 transition-transform" />
                    </div>
                ))}
            </div>

            <div className="premium-card p-10 bg-primary/5 border-primary/20 flex flex-col md:flex-row justify-between items-center gap-8 group/all cursor-crosshair">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-primary/20 rounded-2xl">
                        <Zap className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">Complete Field Log</h4>
                        <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.3em]">Access all regional matches and historical data protocols</p>
                    </div>
                </div>
                <button className="btn-primary px-10 py-4 text-[10px] shadow-2xl group-hover/all:scale-110 transition-transform">
                    Expand Registry
                </button>
            </div>
        </div>
    );
};

export default LiveMatches;
