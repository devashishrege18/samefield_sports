import React, { useState } from 'react';
import { Mic, Cpu, Radio, Zap, Shield, ChevronRight, Activity } from 'lucide-react';

const Commentary = () => {
    const [activeMode, setActiveMode] = useState('both'); // both, ai, human

    const humanComments = [
        { id: 1, time: '67:23', text: 'What a strike! The technique on that volley was absolute class.', author: 'John M. (Comm)' },
        { id: 2, time: '65:00', text: 'Substitution for City Strikers. Looks like they want more pace.', author: 'Sarah K. (Analyst)' },
    ];

    const aiAnalysis = [
        { id: 1, time: '67:24', text: 'Shot Probability: 8% | xG: 0.04 | Speed: 102 km/h', type: 'STATISTICAL' },
        { id: 2, time: '66:10', text: 'Pattern Detected: High press intensity increased by 15% in last 5 mins.', type: 'TACTICAL' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="section-title !mb-2">
                        <Radio className="icon" /> Broadcast Protocol
                    </h2>
                    <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.4em] italic">Multi-Channel Intelligence Feed</p>
                </div>

                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 gap-2">
                    {[
                        { id: 'both', label: 'Hybrid', icon: Activity },
                        { id: 'human', label: 'Human', icon: Mic },
                        { id: 'ai', label: 'AI Intel', icon: Cpu }
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveMode(mode.id)}
                            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeMode === mode.id ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105' : 'text-textMuted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <mode.icon size={14} /> {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`grid gap-8 transition-all duration-700 ${activeMode === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* HUMAN CHANNEL */}
                {(activeMode === 'both' || activeMode === 'human') && (
                    <div className="premium-card p-0 flex flex-col border-white/5 overflow-hidden animate-in slide-in-from-left-8 duration-500">
                        <div className="bg-white/5 border-b border-white/5 p-6 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-primary/20 rounded-xl">
                                    <Mic size={18} className="text-primary animate-pulse" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Audio Feed Alpha</span>
                            </div>
                            <span className="text-[9px] font-black text-primary uppercase animate-pulse tracking-widest italic">Live Recording</span>
                        </div>

                        <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide">
                            {humanComments.map(c => (
                                <div key={c.id} className="relative pl-8 border-l-2 border-primary/20 group/msg py-2 hover:border-primary transition-colors">
                                    <div className="absolute left-[-5px] top-4 w-2 h-2 rounded-full bg-primary/40 group-hover/msg:bg-primary transition-colors shadow-[0_0_10px_var(--primary-glow)]" />
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[9px] font-black text-primary italic tabular-nums tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">{c.time}</span>
                                        <span className="text-[8px] font-black text-textMuted uppercase tracking-widest">{c.author}</span>
                                    </div>
                                    <p className="text-gray-200 text-sm leading-relaxed italic group-hover/msg:text-white transition-colors">"{c.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI CHANNEL */}
                {(activeMode === 'both' || activeMode === 'ai') && (
                    <div className="premium-card p-0 flex flex-col border-white/5 overflow-hidden animate-in slide-in-from-right-8 duration-500">
                        <div className="bg-white/5 border-b border-white/5 p-6 flex justify-between items-center bg-gradient-to-r from-cyan-500/10 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                                    <Cpu size={18} className="text-cyan-400 animate-spin-slow" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-mono">Quantum Processor</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest italic">Analyzing Pattern</span>
                            </div>
                        </div>

                        <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                            {aiAnalysis.map(c => (
                                <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 group/ai relative overflow-hidden hover:border-cyan-500/30 transition-all">
                                    <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] rotate-12 group-hover/ai:rotate-0 transition-transform"><Activity size={80} /></div>
                                    <div className="flex justify-between items-center mb-4 relative z-10">
                                        <span className="text-[9px] font-black text-cyan-400 italic tabular-nums tracking-widest font-mono">{c.time}</span>
                                        <span className="text-[8px] font-black text-cyan-400/60 uppercase tracking-widest border border-cyan-400/20 px-2 py-0.5 rounded-md">{c.type}</span>
                                    </div>
                                    <p className="text-cyan-100 text-[13px] leading-relaxed font-mono drop-shadow-sm relative z-10">
                                        {c.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Commentary;
