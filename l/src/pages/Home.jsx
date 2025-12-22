import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Play, Calendar, Search, TrendingUp, Award, BarChart2, Activity, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import Leaderboard from '../components/Leaderboard';
import TopFansWidget from '../components/TopFansWidget';
import QuickPollWidget from '../components/QuickPollWidget';
import FeaturedCarousel from '../components/FeaturedCarousel';


const Home = () => {
    const navigate = useNavigate();
    const { addPoints } = usePoints();

    const [predictionMade, setPredictionMade] = useState(false);

    const handlePrediction = (player) => {
        if (!predictionMade) {
            addPoints(150, 'Live Prediction Made');
            setPredictionMade(true);
        }
    };

    return (
        <div className="page-frame background-texture">

            {/* Hero Section: Mixed Team Cricket */}
            <div className="relative h-[300px] md:h-[450px] rounded-[32px] overflow-hidden group">
                <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2674&auto=format&fit=crop"
                    alt="Cricket Stadium"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                <div className="absolute inset-0 vignette-overlay" />

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-primary text-black text-[10px] font-black uppercase rounded-lg animate-pulse">
                            ● World Premiere
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-none uppercase">
                        History in the <br />
                        <span className="text-primary">Making</span>
                    </h1>
                    <p className="text-sm md:text-xl font-bold text-white uppercase tracking-wider max-w-xl">
                        First-Ever Mixed Team Cricket Tournament
                    </p>
                    <p className="text-xs md:text-sm text-gray-300 italic max-w-md font-medium">
                        "Redefining how teams are formed in modern sport."
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/watch')}
                            className="px-8 py-3.5 bg-primary text-black rounded-full font-black uppercase text-sm flex items-center gap-2 hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
                        >
                            Watch Live <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button className="px-8 py-3.5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-bold uppercase text-sm hover:bg-white/10 transition-all de-emphasized">
                            Tournament Info
                        </button>
                    </div>
                </div>

            </div>

            {/* SINGLE COLUMN NARRATIVE FLOW */}
            <div className="space-y-10 mt-8">

                {/* PRIMARY CONTENT RAIL */}
                <div className="space-y-10">


                    {/* Featured Events Carousel */}
                    <FeaturedCarousel />


                    {/* Live & Upcoming Matches */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" /> Match Centre
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {/* Live Card */}
                            <div className="premium-card p-0 flex flex-col md:flex-row overflow-hidden group">
                                <div className="w-full md:w-1/3 bg-black relative flex items-center justify-center p-6 border-r border-surfaceHighlight">
                                    <img src="/assets/generic_sport_thumb.png" alt="Live" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded-sm animate-pulse z-10">Live</div>
                                    <div className="text-center relative z-10">
                                        <div className="flex items-center justify-center gap-4 text-2xl font-black text-white mb-2">
                                            <span>IND</span> <span className="text-textMuted text-lg">vs</span> <span>AUS</span>
                                        </div>
                                        <p className="text-xs text-primary font-bold uppercase tracking-widest">Mixed T20 • Innings 2</p>
                                        <p className="text-sm text-textMuted mt-1">AUS needs 42 runs in 28 balls</p>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between bg-surface/50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Semi-Final 1</h3>
                                            <p className="text-xs text-textMuted">Wankhede Stadium, Mumbai</p>
                                        </div>
                                        <button className="px-4 py-1.5 rounded-full bg-primary text-black text-xs font-bold uppercase hover:bg-white transition-colors">Watch</button>
                                    </div>
                                    <div className="w-full bg-surfaceHighlight h-1 rounded-full overflow-hidden">
                                        <div className="w-[70%] h-full bg-primary" />
                                    </div>
                                    <p className="text-[10px] text-right text-textMuted mt-1">Win Probability: IND 70%</p>
                                </div>
                            </div>

                            {/* Upcoming Card */}
                            <div className="premium-card p-4 flex items-center justify-between hover:bg-surfaceHighlight/30 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="text-center w-12 text-xs font-bold text-textMuted">
                                        <span className="block text-white text-sm">18:00</span>
                                        Today
                                    </div>
                                    <div className="h-8 w-[1px] bg-surfaceHighlight" />
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-white">ENG (Mix)</span>
                                        <span className="text-xs text-textMuted">vs</span>
                                        <span className="font-bold text-white">SA (Mix)</span>
                                    </div>
                                </div>
                                <button className="p-2 text-textMuted hover:text-white"><ArrowUpRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </section>

                    {/* Trending Highlights */}
                    <section>
                        <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Trending Now
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Incredible one-handed catch!', img: '/assets/thumb_redbull_extreme_1765784514775.png' },
                                { title: 'Last minute goal!', img: '/assets/thumb_womens_football_1765784471060.png' },
                                { title: 'Perfect 10 Ride', img: '/assets/thumb_surfing_wsl_1765784559697.png' },
                                { title: 'Buzzer Beater 3pt', img: '/assets/thumb_fiba_basketball_1765784610870.png' }
                            ].map((highlight, i) => (
                                <div key={i} className="premium-card relative aspect-video group overflow-hidden cursor-pointer">
                                    <img src={highlight.img} alt="Highlight" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-3 bg-primary/90 rounded-full text-black">
                                            <Play className="w-6 h-6 fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 w-full p-4">
                                        <span className="tiniest-text text-primary uppercase font-bold bg-black/50 px-1 rounded">Highlight</span>
                                        <p className="text-white font-bold leading-tight mt-1">{highlight.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Alive Signal Bar */}
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 rounded-xl border border-primary/20 flex items-center gap-4">
                        <div className="relative">
                            <div className="p-2.5 bg-primary/20 rounded-full">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm flex items-center gap-2">
                                <span className="status-live">Live</span>
                                <span className="text-primary">12,430 fans</span> watching right now
                            </p>
                            <p className="text-xs text-textMuted mt-0.5">Join the conversation in the Forum or Voice Rooms.</p>
                        </div>
                    </div>
                </div>

                {/* ENGAGEMENT ROW - Real-time widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Quick Poll - Real-time Firebase */}
                    <QuickPollWidget />

                    {/* Live Prediction - Compact */}
                    <div className="premium-card p-4 glow-on-hover">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            Live Prediction
                        </h4>
                        <p className="text-[10px] text-textMuted mb-2">Mixed Team Finals - Who wins?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePrediction('A')}
                                className={`flex-1 py-2 bg-surfaceHighlight text-[10px] font-bold rounded hover:bg-primary hover:text-black transition-colors ${predictionMade ? 'opacity-50' : ''}`}
                            >
                                Team A
                            </button>
                            <button
                                onClick={() => handlePrediction('B')}
                                className={`flex-1 py-2 bg-surfaceHighlight text-[10px] font-bold rounded hover:bg-primary hover:text-black transition-colors ${predictionMade ? 'opacity-50' : ''}`}
                            >
                                Team B
                            </button>
                        </div>
                    </div>

                    {/* Top Fans - Real-time Firebase */}
                    <TopFansWidget />
                </div>

            </div>

            {/* TERMINATION ZONE */}
            <div className="zone-c" />

        </div>
    );
};

export default Home;
