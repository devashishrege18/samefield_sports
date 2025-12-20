import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RoomList from '../components/VoiceRoom/RoomList';
import { Bell, Search, Zap, Users, Shield, Activity, Radio, Globe, ChevronRight, Cpu, Signal, Wifi, Mic } from 'lucide-react';
import { usePoints } from '../context/PointsContext';

import MobileNav from '../components/MobileNav';
import UsernameModal from '../components/UsernameModal';

const DashboardLayout = () => {
    const location = useLocation();
    const { points, notifications, userId } = usePoints();
    const [displayPoints, setDisplayPoints] = useState(points);
    const [userName, setUserName] = useState(localStorage.getItem('samefield_username') || 'Guest Fan');
    const [showVoicePanel, setShowVoicePanel] = useState(false);

    useEffect(() => {
        const handleNameUpdate = () => {
            setUserName(localStorage.getItem('samefield_username') || 'Guest Fan');
        };
        window.addEventListener('usernameUpdated', handleNameUpdate);
        return () => window.removeEventListener('usernameUpdated', handleNameUpdate);
    }, []);

    useEffect(() => {
        let start = displayPoints;
        const end = points;
        const duration = 1200;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 5);
            const current = Math.floor(start + (end - start) * ease);
            setDisplayPoints(current);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [points]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1440) setShowVoicePanel(true);
            else if (window.innerWidth < 1280) setShowVoicePanel(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPageTitle = (pathname) => {
        const path = pathname.split('/')[1];
        if (!path) return 'Featured';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="flex h-screen bg-black text-white font-outfit overflow-hidden selection:bg-white selection:text-black">
            {/* AMBIENT BACKGROUND SYSTEM */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.02] blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.01] blur-[120px]" />
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* GLOBAL HEADER */}
                <header className="h-24 flex items-center justify-between px-12 z-50 transition-all">
                    <div className="flex items-center gap-8">
                        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase transform scale-y-90">
                            {getPageTitle(location.pathname)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* XP DISPLAY */}
                        <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-3 rounded-full border border-white/5 hover:bg-white/5 transition-all cursor-default group">
                            <Zap className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-sm font-black tabular-nums text-white group-hover:text-primary transition-colors">{displayPoints.toLocaleString()}</span>
                            </div>
                            <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">XP</span>
                        </div>

                        {/* VOICE PANEL TOGGLE */}
                        <button
                            onClick={() => setShowVoicePanel(!showVoicePanel)}
                            className={`hidden xl:flex items-center gap-3 px-6 py-3 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${showVoicePanel ? 'bg-white text-black border-white' : 'border-white/5 bg-white/[0.03] text-white/40 hover:text-white hover:bg-white/10'}`}
                        >
                            <Mic className="w-4 h-4" />
                            {showVoicePanel ? 'Voice Active' : 'Voice Room'}
                        </button>

                        <div className="h-8 w-[1px] bg-white/5 hidden md:block" />

                        {/* USER PROFILE LINK */}
                        <Link to="/profile" className="flex items-center gap-4 group/user">
                            <div className="text-right hidden sm:block">
                                <span className="block text-sm font-bold text-white leading-none group-hover/user:text-primary transition-colors">{userName}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-white/10 p-0.5 bg-black relative overflow-hidden group-hover/user:border-primary transition-colors">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="w-full h-full rounded-full" />
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden relative">
                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative scrollbar-hide pb-24 md:pb-16 transition-all duration-700">
                        <div className="max-w-[1920px] mx-auto min-h-full">
                            <Outlet />
                        </div>

                        {/* NOTIFICATIONS */}
                        <div className="fixed bottom-12 right-12 flex flex-col items-end gap-4 pointer-events-none z-[75]">
                            {notifications.map((n) => (
                                <div key={n.id} className="animate-slide-up flex items-center gap-6 bg-black/90 backdrop-blur-xl text-white px-8 py-6 rounded-2xl shadow-2xl border border-white/5">
                                    <div className="p-3 bg-white/5 rounded-full">
                                        <Zap className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-black text-white text-2xl tracking-tight italic">+{n.amount}</p>
                                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Rewards</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest flex items-center gap-2">
                                            {n.reason}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                    {/* SIDEPANEL - VOICE */}
                    <div className={`${showVoicePanel ? 'fixed inset-0 top-20 md:static md:inset-auto z-[60] bg-black/95 md:bg-transparent flex flex-col' : 'hidden'}`}>
                        <div className="h-full w-full md:w-[380px] border-l border-white/5 bg-black flex flex-col shadow-2xl">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-black text-white uppercase tracking-widest text-[11px] italic">Voice Rooms</span>
                                    <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest mt-1">Active Channels</p>
                                </div>
                                <button
                                    onClick={() => setShowVoicePanel(false)}
                                    className="bg-white/5 hover:bg-white/10 text-white/60 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
                                <RoomList />
                            </div>
                        </div>
                    </div>
                </div>

                {/* MOBILE NAVIGATION */}
                <MobileNav />
            </div>

            <UsernameModal />
        </div>
    );
};

export default DashboardLayout;
