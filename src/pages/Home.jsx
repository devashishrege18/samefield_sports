import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Play, Calendar, Search, TrendingUp, Award, BarChart2, Activity, ChevronRight, ChevronLeft, Target, Zap, Shield, Rss, Mic, Globe, Cpu, Radio, Signal } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import Leaderboard from '../components/Leaderboard';
import LiveMatches from '../components/LiveMatches';
import NewsEvents from '../components/NewsEvents';
import PlayerMeet from '../components/PlayerMeet';
import Commentary from '../components/Commentary';

const Home = () => {
    const { points, addPoints } = usePoints();
    const [pollVoted, setPollVoted] = useState(false);
    const [predictionMade, setPredictionMade] = useState(false);
    const [displayPoints, setDisplayPoints] = useState(points);

    useEffect(() => {
        let start = displayPoints;
        const end = points;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * ease);
            setDisplayPoints(current);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [points]);

    const handlePrediction = (player) => {
        if (!predictionMade) {
            addPoints(150, 'Live Prediction Made');
            setPredictionMade(true);
        }
    };

    const handlePoll = () => {
        if (!pollVoted) {
            addPoints(50, 'Quick Poll Participation');
            setPollVoted(true);
        }
    };

    return (
        <div className="page-container">
            {/* ATMOSPHERIC SEARCH & NAVIGATION HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-center gap-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Sports<span className="text-primary italic">Central</span>
                    </h1>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.4em]">Home • Live Events • Recommendations</p>
                </div>

                <div className="relative w-full xl:w-[600px] group">
                    <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-all duration-500" />
                    <input
                        type="text"
                        placeholder="Search for players, matches, or legendary moments..."
                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-8 py-5 rounded-2xl text-[11px] font-bold tracking-widest focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* CINEMATIC FEATURED HERO */}
            <div className="relative h-[650px] xl:h-[800px] rounded-[40px] overflow-hidden group shadow-premium border border-white/5 bg-black">
                {/* DYNAMIC ATMOSPHERIC BACKGROUND */}
                <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2674&auto=format&fit=crop"
                    alt="Featured Arena"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-[4000ms] ease-out scale-105 group-hover:scale-100"
                />

                {/* CINEMATIC OVERLAYS */}
                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black via-black/20 to-transparent z-10" />

                <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-12 xl:px-24 space-y-10 max-w-6xl z-30 pt-20">
                    <div className="flex items-center gap-5 animate-slide-up">
                        <div className="px-4 py-1.5 bg-primary/20 border border-primary/20 rounded-lg">
                            <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Featured Event</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/40 tracking-[0.4em] uppercase">Live from London</span>
                    </div>

                    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h1 className="text-[70px] xl:text-[110px] font-black text-white tracking-tighter leading-[0.85] uppercase flex flex-col italic">
                            <span>Battle of</span>
                            <span className="text-white/20">The Legends</span>
                        </h1>
                        <p className="text-sm xl:text-xl text-text-muted max-w-2xl font-medium leading-relaxed">
                            A historic encounter at the peak of athletic excellence. Witness the world's elite go head-to-head in a definitive clash of speed, power, and strategy.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 pt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <button className="w-full sm:w-auto btn-primary flex items-center justify-center gap-4">
                            Resume Watch <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button className="w-full sm:w-auto btn-outline flex items-center justify-center gap-4">
                            Event Intel <BarChart2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ATMOSPHERIC STATS HUD */}
                <div className="absolute bottom-16 right-16 z-30 hidden xl:flex gap-10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    {[
                        { label: 'Active Viewers', val: '2.4M', icon: Globe },
                        { label: 'Global Signals', val: '128K', icon: Radio },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-end">
                            <p className="text-3xl font-black text-white italic tracking-tighter">{s.val}</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mt-1 italic">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
                {/* MAIN CONTENT FEED */}
                <div className="xl:col-span-8 space-y-32">

                    {/* TRENDING NOW - NETFLIX ROW */}
                    <section className="space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="section-title">
                                <TrendingUp className="w-4 h-4 text-primary" /> Recommended for You
                            </h2>
                            <div className="flex gap-4">
                                <button className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white hover:text-black transition-all">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white hover:text-black transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[
                                { id: 1, title: 'Titan League Finals', type: 'Upcoming', img: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80', date: 'Dec 24, 2023' },
                                { id: 2, title: 'Sector Semis: Alpha', type: 'Live', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80', date: 'Dec 20, 2023' }
                            ].map((ev) => (
                                <div key={ev.id} className="premium-card p-0 group h-[450px] cursor-pointer">
                                    <img src={ev.img} alt={ev.title} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105 opacity-60 group-hover:opacity-100" />
                                    <div className="vanguard-overlay group-hover:opacity-60 transition-opacity" />

                                    <div className="absolute top-8 left-8 z-20">
                                        <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${ev.type === 'Live' ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-black/60 border-white/10 text-white/60'}`}>
                                            {ev.type}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 left-10 right-10 z-20 transition-all duration-500 transform group-hover:-translate-y-2">
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] italic">{ev.date}</span>
                                            <h4 className="font-extrabold text-white text-3xl tracking-tighter uppercase leading-none italic">{ev.title}</h4>
                                            <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-700" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <LiveMatches />
                    <div className="premium-card p-12 bg-white/[0.01]">
                        <Commentary />
                    </div>
                    <NewsEvents />
                    <PlayerMeet />
                </div>

                {/* SIDEBAR - REFINED MODULES */}
                <div className="xl:col-span-4 space-y-16 h-fit">

                    {/* PREMIUM USER XP WIDGET */}
                    <div className="premium-card p-12 bg-white/[0.02]">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                <Zap className="w-4 h-4 text-primary" /> Member Progression
                            </h3>
                            <Award className="w-5 h-5 text-white/10" />
                        </div>

                        <div className="flex flex-col items-center py-8">
                            <div className="relative">
                                <span className="text-8xl font-black text-white tracking-tighter tabular-nums italic">
                                    {displayPoints.toLocaleString()}
                                </span>
                                <div className="absolute -top-4 -right-8 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                            </div>
                            <div className="flex items-center gap-4 mt-6 px-6 py-2 bg-white/[0.04] rounded-full border border-white/5">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Vanguard Elite</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-10">
                            <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/[0.05]">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Global Rank</p>
                                <p className="text-3xl font-black text-white tracking-tighter italic">#42</p>
                            </div>
                            <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/[0.05]">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Win Parity</p>
                                <p className="text-3xl font-black text-white tracking-tighter italic">87%</p>
                            </div>
                        </div>
                    </div>

                    {/* REFINED PREDICTION MODULE */}
                    <div className="premium-card p-0 border-primary/20 group/predict scale-100 hover:scale-[1.03] transition-all duration-700">
                        <div className="bg-primary/10 p-8 border-b border-primary/10 flex justify-between items-center">
                            <div className="flex items-center gap-5">
                                <Target className="w-5 h-5 text-primary" />
                                <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.2em]">Open Prediction</span>
                            </div>
                            <span className="text-[10px] font-black bg-primary text-black px-4 py-1.5 rounded-lg italic">2.5X Yield</span>
                        </div>

                        <div className="p-10 space-y-8">
                            <h4 className="text-xl font-extrabold text-white uppercase tracking-tight leading-[1.2] italic">
                                Who will secure the definitive wicket?
                            </h4>

                            <div className="space-y-4">
                                {[
                                    { id: 'A', name: 'Zara Williams', prob: '45%' },
                                    { id: 'B', name: 'Sam Chen', prob: '55%' }
                                ].map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => handlePrediction(p.id)}
                                        disabled={predictionMade}
                                        className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all duration-500 ${predictionMade
                                            ? 'bg-white/5 border-white/5 opacity-50 text-white/40 cursor-not-allowed'
                                            : 'bg-white/[0.03] border-white/10 text-white hover:border-primary/60 hover:bg-white/[0.06] hover:translate-x-1'
                                            }`}
                                    >
                                        <span className="text-xs font-black uppercase tracking-[0.1em] italic">{p.name}</span>
                                        <span className="text-[10px] font-black text-primary italic">{p.prob}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6 px-4">
                            <Globe className="w-4 h-4 text-primary/40" />
                            <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Global Leaderboard</span>
                        </div>
                        <Leaderboard />
                    </div>

                    {/* ACTIVITY STREAM */}
                    <div className="bg-white/[0.02] rounded-[32px] p-10 border border-white/5 space-y-8">
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center gap-4">
                            <Activity size={16} className="text-primary/40" /> Latest Activity
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-5">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 animate-pulse" />
                                <p className="text-[11px] font-medium text-white/50 leading-relaxed italic">
                                    Zara W. achieved <span className="text-white font-black">Elite Status</span> in London Sector
                                </p>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full mt-2" />
                                <p className="text-[11px] font-medium text-white/30 leading-relaxed italic">
                                    Global Event synchronization finalized 5m ago
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CALL TO ACTION - CINEMATIC FINALE */}
            <div className="premium-card p-24 text-center space-y-12 mt-24 mb-32 bg-gradient-to-b from-white/[0.03] to-transparent border-white/10 group">
                <div className="space-y-6">
                    <h2 className="text-6xl xl:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">The Future of <br /><span className="text-primary italic">Live Sports</span></h2>
                    <p className="text-xs xl:text-sm text-text-muted font-bold uppercase tracking-[0.6em] leading-relaxed max-w-2xl mx-auto italic">
                        Experience every moment in cinematic fidelity. Join the world's most sophisticated sports community.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-10">
                    <button className="btn-primary px-16 group-hover:scale-105 transition-transform duration-700">Enter Arena</button>
                    <button className="btn-outline px-16 group-hover:scale-105 transition-transform duration-700">Explore Tiers</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
