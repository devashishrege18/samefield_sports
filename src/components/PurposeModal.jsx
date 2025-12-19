import React, { useState, useEffect } from 'react';
import { Video, Star, Heart, Trophy, ChevronRight } from 'lucide-react';

const BlockbusterPurposeModal = () => {
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

    // Rich content: Women in sports focus (training, matches, crowds, grassroots)
    const posters = [
        "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530549387634-e797817f9a91?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612872080531-421e3050c410?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1461896704190-3213c9607051?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544698310-74ea0d0d50cb?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526676037777-05a232534f57?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1431324155629-1a6eda1dec2d?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop",
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden font-outfit select-none flex flex-col items-center justify-center">

            {/* BACKGROUND: High-Density Texture Wall */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-[-20%] grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-2 opacity-30 blur-[6px] grayscale-[60%] animate-slow-drift"
                >
                    {[...posters, ...posters, ...posters, ...posters].map((img, i) => (
                        <div key={i} className="aspect-[2/3] rounded-sm overflow-hidden border border-white/5">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                </div>

                {/* BACKGROUND TREATMENT: Vignette & Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
            </div>

            {/* FOREGROUND: Core Content Layer */}
            <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center space-y-12 animate-blockbuster-entry">

                {/* TEXT HIERARCHY: Dominant Headline */}
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3 mb-4 opacity-50">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.6em]">Samefield Sports</span>
                        <Trophy className="w-4 h-4 text-primary" />
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                        Watch. Support.<br />
                        <span className="text-primary italic">Elevate.</span>
                    </h1>

                    {/* Body Text: Human-Written Clean Statement */}
                    <div className="max-w-3xl mx-auto pt-4">
                        <p className="text-lg md:text-3xl font-medium text-gray-300 tracking-tight leading-tight">
                            Join the movement to amplify women athletes. <br className="hidden md:block" />
                            Every point you earn creates <span className="text-white">real impact.</span>
                        </p>
                        <p className="text-xs md:text-sm font-bold text-primary/80 tracking-[0.2em] uppercase mt-6 italic">
                            Elevating women’s sports, one point at a time.
                        </p>
                    </div>
                </div>

                {/* PROCESS: Minimalist Icons */}
                <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-white/10">
                    {[
                        { icon: Video, text: "Watch Matches" },
                        { icon: Heart, text: "Earn XP" },
                        { icon: Star, text: "Unlock Rewards" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <item.icon className="w-6 h-6 text-primary" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* CTA: Rock Solid Confidence */}
                <div className="pt-4">
                    <button
                        onClick={handleDismiss}
                        className="px-16 py-6 bg-primary text-black rounded-lg font-black uppercase text-lg tracking-[0.2em] transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,215,0,0.2)]"
                    >
                        Start Supporting
                    </button>
                    <p className="mt-8 text-[9px] text-white/30 uppercase tracking-[0.8em] font-black">EST. 2025 • Purpose First</p>
                </div>

            </div>

            <style>{`
                @keyframes slow-drift {
                    0% { transform: scale(1.1) translate(0, 0); }
                    100% { transform: scale(1.1) translate(-2%, -2%); }
                }
                .animate-slow-drift {
                    animation: slow-drift 60s linear infinite alternate;
                }
                @keyframes blockbuster-entry {
                    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-blockbuster-entry {
                    animation: blockbuster-entry 1s cubic-bezier(0.2, 0, 0, 1) forwards;
                }
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
};

export default BlockbusterPurposeModal;
