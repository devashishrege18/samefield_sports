import React, { useState, useEffect } from 'react';
import { Video, Mic, Star, Heart, X, ChevronRight, Trophy } from 'lucide-react';

const PurposeModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenPurpose = localStorage.getItem('samefield_purpose_seen');
        if (!hasSeenPurpose) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('samefield_purpose_seen', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    // Athlete Thumbnails for Netflix-style collage
    const athletes = [
        "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=400&auto=format&fit=crop", // Women Basketball
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop", // Women Football
        "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400&auto=format&fit=crop", // Stadium
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop", // Sport Action
        "https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=400&auto=format&fit=crop", // Women Athlete
        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=400&auto=format&fit=crop", // Women Tennis
        "https://images.unsplash.com/photo-1530549387634-e797817f9a91?q=80&w=400&auto=format&fit=crop", // Swimming
        "https://images.unsplash.com/photo-1612872080531-421e3050c410?q=80&w=400&auto=format&fit=crop", // Volleyball
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&auto=format&fit=crop", // Cricket Ground
        "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?q=80&w=400&auto=format&fit=crop", // Crowd
        "https://images.unsplash.com/photo-1461896704190-3213c9607051?q=80&w=400&auto=format&fit=crop", // Running
        "https://images.unsplash.com/photo-1544698310-74ea0d0d50cb?q=80&w=400&auto=format&fit=crop", // Women Sport
        "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400&auto=format&fit=crop", // Action
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400&auto=format&fit=crop", // Soccer
        "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=400&auto=format&fit=crop", // Gym
        "https://images.unsplash.com/photo-1526676037777-05a232534f57?q=80&w=400&auto=format&fit=crop", // Badminton
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden font-outfit">

            {/* Netflix-style Tilted Background Grid */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                <div
                    className="absolute inset-[-50%] grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 transform rotate-[-20deg] scale-125 translate-y-[-10%] animate-slow-scroll"
                >
                    {[...athletes, ...athletes, ...athletes].map((img, i) => (
                        <div key={i} className="aspect-[2/3] md:aspect-[3/4] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                            <img src={img} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" alt="" />
                        </div>
                    ))}
                </div>
                {/* Dark Vignette Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
                <div className="absolute inset-0 bg-radial-gradient(circle, transparent 20%, black 100%) opacity-60" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col items-center text-center space-y-12">

                {/* Premium Header */}
                <div className="space-y-4 animate-fade-in-up">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full mb-6">
                        <Trophy className="w-5 h-5 text-primary fill-primary/20" />
                        <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">The Future of Fandom</span>
                    </div>

                    <h1 className="text-5xl md:text-9xl font-black text-white italic tracking-tighter leading-[0.85] uppercase">
                        Watch. <span className="text-primary italic font-playfair lowercase normal-case">support.</span> <br />
                        <span className="font-playfair italic capitalize text-white">Elevate</span> Women in Sports.
                    </h1>

                    <div className="pt-6 space-y-4 max-w-3xl mx-auto">
                        <p className="text-xl md:text-3xl font-medium text-gray-200 uppercase tracking-tight leading-tight">
                            A live sports platform where supporting women athletes <br className="hidden md:block" />
                            turns into <span className="text-primary font-playfair italic lowercase normal-case text-4xl md:text-6xl mx-2 underline underline-offset-8 decoration-primary/30">real impact.</span>
                        </p>
                        <div className="inline-block py-2 px-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm mt-4">
                            <p className="text-[10px] md:text-xs font-black text-primary/80 italic tracking-widest uppercase">
                                Points are earned only by engaging with women’s sports.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How Samefield Works - Premium View */}
                <div className="w-full max-w-4xl space-y-8 animate-fade-in-up animation-delay-300">
                    <div className="flex items-center gap-6">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                        <h3 className="text-xs font-black text-primary/60 uppercase tracking-[0.5em] font-outfit">How it Works</h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Video, text: "Watch women's sports", accent: false },
                            { icon: Heart, text: "Earn Support Points", accent: true },
                            { icon: Star, text: "Unlock real opportunities", accent: false }
                        ].map((item, idx) => (
                            <div key={idx} className={`group p-6 rounded-[32px] border transition-all duration-500 cursor-default flex flex-col items-center ${item.accent ? 'bg-primary border-primary shadow-[0_20px_40px_rgba(255,184,0,0.2)] scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                <div className={`p-4 rounded-2xl mb-4 group-hover:rotate-12 transition-transform ${item.accent ? 'bg-black/20' : 'bg-primary/10'}`}>
                                    <item.icon className={`w-8 h-8 ${item.accent ? 'text-black fill-black/20' : 'text-primary'}`} />
                                </div>
                                <p className={`text-base md:text-lg font-black uppercase italic leading-tight ${item.accent ? 'text-black' : 'text-white'}`}>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="py-3 px-8 bg-black/40 border border-white/10 rounded-full inline-block backdrop-blur-xl">
                        <p className="text-xs md:text-sm font-bold text-white uppercase tracking-[0.15em]">
                            Every point on Samefield <span className="text-primary font-playfair italic lowercase normal-case text-lg mx-2 underline underline-offset-4 decoration-primary/50">represents support</span> for women athletes.
                        </p>
                    </div>
                </div>

                {/* Master CTA */}
                <div className="pt-8 animate-fade-in-up animation-delay-500">
                    <button
                        onClick={handleDismiss}
                        className="group relative px-16 py-6 bg-white text-black rounded-[24px] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                    >
                        <div className="absolute inset-0 bg-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                        <div className="relative z-10 flex items-center gap-4">
                            <span className="text-xl font-black uppercase tracking-widest">Start Supporting Now</span>
                            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                        </div>
                    </button>
                    <p className="mt-6 text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Limited Founders Access • Mumbai, India</p>
                </div>
            </div>

            {/* Style injections for unique animations */}
            <style>{`
                @keyframes slow-scroll {
                    0% { transform: rotate(-20deg) scale(1.25) translateY(-20%); }
                    100% { transform: rotate(-20deg) scale(1.25) translateY(-5%); }
                }
                .animate-slow-scroll {
                    animation: slow-scroll 60s linear infinite alternate;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1s cubic-bezier(0.2, 0, 0, 1) forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animation-delay-300 { animation-delay: 0.3s; }
                .animation-delay-500 { animation-delay: 0.5s; }
                .font-playfair { font-family: 'Playfair Display', serif; }
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
};

export default PurposeModal;
