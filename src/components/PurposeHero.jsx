import React from 'react';
import { Play, Mic, Star, Video, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PurposeHero = () => {
    return (
        <section className="relative w-full min-h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-white/10 group flex flex-col items-center justify-center px-6 py-12 text-center">
            {/* Background with Stadium Atmosphere */}
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                aria-hidden="true"
            />
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />

            <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
                {/* Headline Banner */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-none uppercase">
                        Watch. <span className="text-primary italic">Support.</span> Elevate <br className="hidden md:block" />
                        <span className="text-white">Women in Sports.</span>
                    </h1>

                    <div className="space-y-2">
                        <p className="text-lg md:text-2xl font-bold text-gray-200 uppercase tracking-wide">
                            A live sports platform where supporting women athletes <br className="hidden md:block" />
                            turns into <span className="text-primary">real impact.</span>
                        </p>
                        <p className="text-[10px] md:text-xs font-medium text-primary/80 italic uppercase tracking-widest">
                            Points are earned only by engaging with women’s sports.
                        </p>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link to="/watch" className="group/btn relative px-8 py-4 bg-gradient-to-r from-primary to-yellow-500 rounded-xl flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,184,0,0.3)]">
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                        <div className="p-1.5 bg-black/20 rounded-lg">
                            <Video className="w-5 h-5 text-black fill-current" />
                        </div>
                        <span className="text-sm font-black text-black uppercase tracking-wider">Watch Women Live</span>
                    </Link>

                    <Link to="/forum" className="px-8 py-4 bg-white/5 border border-white/10 hover:border-primary/50 rounded-xl flex items-center gap-3 transition-all hover:bg-white/10 group/secondary">
                        <div className="p-1.5 bg-white/5 rounded-lg group-hover/secondary:bg-primary/20">
                            <Mic className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-black text-white uppercase tracking-wider">Join Live Rooms</span>
                    </Link>

                    <button className="group/btn relative px-8 py-4 bg-gradient-to-r from-primary to-yellow-500 rounded-xl flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,184,0,0.3)]">
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                        <div className="p-1.5 bg-black/20 rounded-lg">
                            <Star className="w-5 h-5 text-black fill-current" />
                        </div>
                        <span className="text-sm font-black text-black uppercase tracking-wider">Earn Support Points</span>
                    </button>
                </div>

                {/* How Samefield Works - This must be visible without scrolling on desktop */}
                <div className="pt-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">How Samefield Works</h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group/item hover:bg-white/10 transition-colors">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover/item:rotate-12 transition-transform">
                                <Video className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-white uppercase tracking-wider italic">Watch women's sports</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group/item hover:bg-white/10 transition-colors border-primary/20 bg-primary/5">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover/item:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-primary fill-primary/20" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-white uppercase tracking-wider italic">Earn Support Points</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group/item hover:bg-white/10 transition-colors">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover/item:-rotate-12 transition-transform">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-white uppercase tracking-wider italic">Unlock real opportunities</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-2 px-6 bg-primary/10 border border-primary/20 rounded-full inline-block backdrop-blur-md">
                        <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest leading-none">
                            Every point on Samefield <span className="text-primary tracking-[0.2em]">represents support</span> for women athletes.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PurposeHero;
