import React, { useState, useEffect } from 'react';
import { Video, Star, Heart, Trophy, ChevronRight } from 'lucide-react';

const PurposeRefinedModal = () => {
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

    // High-density athlete collage (shorter images, more variety)
    const athletes = [
        "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530549387634-e797817f9a91?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612872080531-421e3050c410?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1461896704190-3213c9607051?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544698310-74ea0d0d50cb?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526676037777-05a232534f57?q=80&w=200&auto=format&fit=crop",
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden font-outfit select-none">

            {/* Netflix-style Tilted Background Grid (High Density) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
                <div
                    className="absolute inset-[-60%] grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-2 transform rotate-[-25deg] scale-150 animate-slow-scroll"
                >
                    {[...athletes, ...athletes, ...athletes, ...athletes].map((img, i) => (
                        <div key={i} className="aspect-[4/5] rounded-lg overflow-hidden border border-white/5 shadow-xl">
                            <img src={img} className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-700" alt="" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-v from-black via-black/30 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
            </div>

            {/* Content Container (Optimized Spacing) */}
            <div className="relative z-10 w-full max-w-5xl px-4 py-8 flex flex-col items-center text-center justify-center min-h-screen space-y-8 md:space-y-12">

                {/* Header Section (Casual Aesthetic) */}
                <div className="space-y-4 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-4">
                        <Trophy className="w-4 h-4 text-primary fill-primary/20" />
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">Our Mission</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-light text-white tracking-tight leading-[1.1]">
                        Watch. <span className="font-playfair italic text-primary">Support.</span> <br />
                        <span className="font-bold text-white uppercase tracking-tighter">Elevate</span> Women in Sports.
                    </h1>

                    <div className="max-w-2xl mx-auto space-y-4">
                        <p className="text-lg md:text-2xl font-medium text-gray-300 tracking-tight leading-relaxed">
                            A live sports platform where supporting women athletes <br className="hidden md:block" />
                            turns into <span className="text-primary font-playfair italic underline underline-offset-4 decoration-primary/20">real impact.</span>
                        </p>
                        <p className="text-[10px] md:text-xs font-medium text-primary/60 tracking-[0.2em] uppercase italic bg-primary/5 py-1 px-4 inline-block rounded-lg border border-primary/10">
                            Points are earned only by engaging with women’s sports.
                        </p>
                    </div>
                </div>

                {/* How It Works (Stylish Density) */}
                <div className="w-full max-w-3xl space-y-6 animate-fade-in-up animation-delay-300">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/10" />
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.6em]">Process</h3>
                        <div className="h-[1px] flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        {[
                            { icon: Video, text: "Watch women's sports", accent: false },
                            { icon: Heart, text: "Earn Support Points", accent: true },
                            { icon: Star, text: "Unlock real opportunities", accent: false }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-5 rounded-3xl border transition-all duration-500 flex flex-col items-center ${item.accent ? 'bg-primary border-primary shadow-xl shadow-primary/10 scale-105' : 'bg-white/5 border-white/10'}`}>
                                <div className={`p-3 rounded-2xl mb-3 ${item.accent ? 'bg-black/10' : 'bg-primary/10'}`}>
                                    <item.icon className={`w-6 h-6 ${item.accent ? 'text-black fill-black/10' : 'text-primary'}`} />
                                </div>
                                <p className={`text-sm font-bold uppercase tracking-wide italic ${item.accent ? 'text-black' : 'text-white'}`}>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="py-2.5 px-6 bg-white/5 border border-white/10 rounded-full inline-block backdrop-blur-md">
                        <p className="text-[10px] md:text-xs font-medium text-white/70 uppercase tracking-[0.1em]">
                            Every point on Samefield <span className="text-primary font-playfair italic normal-case text-base mx-1 underline underline-offset-4">represents support</span> for women athletes.
                        </p>
                    </div>
                </div>

                {/* Footer Action (Premium Minimalist) */}
                <div className="pt-4 animate-fade-in-up animation-delay-500">
                    <button
                        onClick={handleDismiss}
                        className="group relative px-12 py-5 bg-white text-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        <div className="absolute inset-0 bg-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                        <span className="relative z-10 text-base font-black uppercase tracking-widest">Start Supporting</span>
                        <ChevronRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="mt-6 text-[9px] text-white/20 uppercase tracking-[0.5em] font-medium">EST. 2025 • High Fidelity Launch</p>
                </div>
            </div>

            <style>{`
                @keyframes slow-scroll {
                    0% { transform: rotate(-25deg) scale(1.5) translateY(-10%); }
                    100% { transform: rotate(-25deg) scale(1.5) translateY(0%); }
                }
                .animate-slow-scroll {
                    animation: slow-scroll 80s linear infinite alternate;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.2, 0, 0, 1) forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animation-delay-300 { animation-delay: 0.2s; }
                .animation-delay-500 { animation-delay: 0.4s; }
                .font-playfair { font-family: 'Playfair Display', serif; }
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
};

export default PurposeRefinedModal;
