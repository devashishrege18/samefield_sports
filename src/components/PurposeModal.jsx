import React, { useState, useEffect } from 'react';
import { Video, Star, Heart, Trophy, ChevronRight } from 'lucide-react';

const NetflixPurposeModal = () => {
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

    // High-quality vertical posters (2:3 aspect)
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
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518611012118-29a7d63d0c24?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1547941126-3d5322b218b0?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop",
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden font-outfit select-none flex items-center">

            {/* Netflix-style Horizontal Poster Wall (Infinite Loop) */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-40 pointer-events-none">
                <div className="absolute inset-[-20%] grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 transform rotate-[-10deg] scale-125 animate-poster-drift">
                    {[...posters, ...posters, ...posters, ...posters].map((img, i) => (
                        <div key={i} className="aspect-[2/3] rounded-md overflow-hidden bg-surfaceHighlight border border-white/5 shadow-2xl">
                            <img src={img} className="w-full h-full object-cover grayscale-[20%] opacity-80" alt="" />
                        </div>
                    ))}
                </div>
                {/* Vignetting & Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
            </div>

            {/* Content Container (Sign-In Box Style - Right Positioned) */}
            <div className="relative z-10 w-full h-full flex items-center justify-center lg:justify-end lg:pr-32 px-4">

                <div className="w-full max-w-md bg-black/75 backdrop-blur-3xl border border-white/10 rounded-xl p-10 md:p-12 shadow-2xl flex flex-col space-y-8 animate-zoom-in">

                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Our Purpose</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none uppercase">
                            Watch. Support. <br />
                            <span className="text-primary not-italic font-bold tracking-tight">ELEVATE.</span>
                        </h1>
                        <p className="text-textMuted text-sm font-medium tracking-tight leading-relaxed pt-2">
                            A sports platform where supporting women athletes turns into <span className="text-white italic">real impact.</span>
                        </p>
                    </div>

                    {/* How It Works List (Minimalist) */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        {[
                            { icon: Video, text: "Watch Women's Sports" },
                            { icon: Heart, text: "Earn Support Points" },
                            { icon: Star, text: "Unlock Opportunities" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center italic">
                            Points represent active support.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleDismiss}
                            className="w-full py-4 bg-primary text-black rounded-lg font-black uppercase text-sm tracking-[0.2em] hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
                        >
                            Start Supporting
                        </button>
                        <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
                            <div className="h-[1px] w-8 bg-white" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Samefield Sports</span>
                            <div className="h-[1px] w-8 bg-white" />
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes poster-drift {
                    0% { transform: rotate(-10deg) scale(1.25) translateY(0); }
                    100% { transform: rotate(-10deg) scale(1.25) translateY(-10%); }
                }
                .animate-poster-drift {
                    animation: poster-drift 40s linear infinite alternate;
                }
                @keyframes zoom-in {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-zoom-in {
                    animation: zoom-in 0.6s cubic-bezier(0.2, 0, 0, 1) forwards;
                }
                .font-playfair { font-family: 'Playfair Display', serif; }
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
};

export default NetflixPurposeModal;
