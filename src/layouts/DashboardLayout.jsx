import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RoomList from '../components/VoiceRoom/RoomList';
import { Bell, Search, Zap, Users } from 'lucide-react';
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) setShowVoicePanel(true);
            else setShowVoicePanel(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPageTitle = (pathname) => {
        const path = pathname.split('/')[1];
        if (!path) return 'HOME';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="flex h-screen bg-background text-white font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 md:h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-10 shadow-cinematic">
                    <div>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-white">
                            {getPageTitle(location.pathname)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary/30 shadow-glow-gold glow-on-hover transition-all duration-300">
                            <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary fill-primary animate-pulse" />
                            <span className="text-gradient-gold font-black text-sm md:text-lg tabular-nums tracking-widest">{displayPoints.toLocaleString()}</span>
                            <span className="text-[8px] md:text-[10px] text-textMuted font-bold uppercase">XP</span>
                        </div>

                        <div className="relative md:block w-64 hidden">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted z-10" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-surface border border-surfaceHighlight rounded-full py-2 pr-4 text-xs focus:outline-none transition-colors"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>

                        <button
                            onClick={() => setShowVoicePanel(!showVoicePanel)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${showVoicePanel ? 'bg-primary border-primary text-black' : 'border-surfaceHighlight text-textMuted'}`}
                        >
                            <Users className="w-4 h-4" />
                            <span className="hidden md:inline text-[10px] font-black uppercase tracking-wider">{showVoicePanel ? 'Hide Rooms' : 'Rooms'}</span>
                        </button>

                        <button className="relative p-2 text-textMuted hover:text-white transition-all hover:bg-white/5 rounded-full icon-btn">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-glow-red" />
                        </button>

                        <Link to="/profile" className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all group">
                            <div className="text-right hidden md:block">
                                <span className="block text-sm font-bold text-white capitalize group-hover:text-primary transition-colors">{userName}</span>
                                <span className="text-[10px] font-bold text-primary uppercase">Super Fan</span>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-surfaceHighlight p-0.5 avatar-ring group-hover:border-primary transition-colors">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="w-full h-full rounded-full" />
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-8 relative pb-24 md:pb-8">
                        <Outlet />
                        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 flex flex-col items-end gap-2 pointer-events-none z-50">
                            {notifications.map((n) => (
                                <div key={n.id} className="animate-bounce-in flex items-center gap-3 glass-dark text-white px-4 py-2 md:px-6 md:py-3 rounded-xl border-l-4 border-primary shadow-glow-gold">
                                    <Zap className="w-4 h-4 text-primary fill-primary animate-pulse" />
                                    <div>
                                        <p className="font-black text-gradient-gold text-lg md:text-xl">+{n.amount} XP</p>
                                        <p className="text-[10px] font-bold uppercase text-textMuted">{n.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                    <div className={`${showVoicePanel ? 'fixed inset-0 top-16 md:static md:inset-auto z-[60] bg-background md:bg-transparent flex flex-col' : 'hidden'}`}>
                        <div className="h-full w-full md:w-80 border-l border-white/5 bg-black/20 backdrop-blur-sm">
                            <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between">
                                <span className="font-black text-white uppercase">Voice Rooms</span>
                                <button onClick={() => setShowVoicePanel(false)} className="text-xs font-bold text-primary">CLOSE</button>
                            </div>
                            <RoomList />
                        </div>
                    </div>
                </div>
                <MobileNav />
            </div>
            <UsernameModal />
        </div>
    );
};

export default DashboardLayout;
