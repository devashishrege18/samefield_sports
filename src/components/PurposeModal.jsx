import React, { useState, useEffect } from 'react';
import { Video, Mic, Star, Heart, X, ChevronRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PurposeModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in px-4">
            <div className="relative w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-background/40 shadow-[0_0_100px_rgba(255,184,0,0.15)] flex flex-col items-center justify-center text-center p-8 md:p-16">

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all active:scale-90"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Content Overlay Background */}
                <div className="absolute inset-0 -z-10 opacity-30">
                    <img
                        src="https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2674&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
                </div>

                <div className="max-w-4xl space-y-12">
                    {/* Header Section */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full mb-4">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Our Founding Mission</span>
                        </div>

                        <h1 className="text-4xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.9] uppercase">
                            Watch. <span className="text-primary">Support.</span> <br /> Elevate Women in Sports.
                        </h1>

                        <p className="text-lg md:text-2xl font-bold text-gray-200 uppercase tracking-tight max-w-2xl mx-auto leading-relaxed">
                            A live sports platform where supporting women athletes <br className="hidden md:block" />
                            turns into <span className="text-primary italic">real impact.</span>
                        </p>

                        <div className="inline-block px-4 py-1.5 border border-primary/30 bg-primary/5 rounded-lg">
                            <p className="text-xs md:text-sm font-black text-primary/90 italic tracking-widest uppercase">
                                Points are earned only by engaging with women’s sports.
                            </p>
                        </div>
                    </div>

                    {/* How It Works Verbatim Section */}
                    <div className="space-y-8 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">How Samefield Works</h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group cursor-default">
                                <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Video className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-base font-black text-white uppercase italic tracking-wider">Watch women's sports</p>
                            </div>

                            {/* Card 2 */}
                            <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl shadow-[0_0_30px_rgba(255,184,0,0.1)] hover:bg-primary/20 transition-all group cursor-default">
                                <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Heart className="w-8 h-8 text-primary fill-primary/20" />
                                </div>
                                <p className="text-base font-black text-white uppercase italic tracking-wider">Earn Support Points</p>
                            </div>

                            {/* Card 3 */}
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group cursor-default">
                                <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Star className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-base font-black text-white uppercase italic tracking-wider">Unlock real opportunities</p>
                            </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 px-8 py-3 rounded-full inline-block backdrop-blur-md">
                            <p className="text-xs md:text-sm font-bold text-white uppercase tracking-[0.2em] leading-none">
                                Every point on Samefield <span className="text-primary tracking-[0.3em] ml-2">represents support</span> for women athletes.
                            </p>
                        </div>
                    </div>

                    {/* Final Action CTA */}
                    <div className="pt-6">
                        <button
                            onClick={handleDismiss}
                            className="group relative px-12 py-5 bg-gradient-to-r from-primary to-yellow-500 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,184,0,0.2)]"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-black text-black uppercase tracking-widest">Start Supporting Now</span>
                                <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                        <p className="mt-4 text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Experience the Future of Fandom</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurposeModal;
