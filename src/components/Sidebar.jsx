import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlayCircle, Users, MessageSquare, Compass, Hexagon, Menu, ChevronLeft, Activity } from 'lucide-react';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', path: '/', icon: Home, desc: 'Featured' },
        { name: 'Watch', path: '/watch', icon: PlayCircle, desc: 'Live Stream' },
        { name: 'Fandom', path: '/fandom', icon: Users, desc: 'My Circles' },
        { name: 'Forum', path: '/forum', icon: MessageSquare, desc: 'Discussions' },
        { name: 'Discover', path: '/discover', icon: Compass, desc: 'Browse' },
    ];

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const handleNavigation = (path, e) => {
        e.stopPropagation();
        navigate(path);
    };

    return (
        <aside
            className={`hidden md:flex h-screen bg-black border-r border-white/5 flex-col transition-all duration-500 z-[100] relative flex-shrink-0
            ${isExpanded ? 'w-80 shadow-2xl' : 'w-24'} items-center group/sidebar overflow-hidden`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* BRAND */}
            <div className={`relative flex items-center justify-center h-32 w-full mb-6 transition-all duration-500 ${isExpanded ? 'px-10 justify-start' : ''}`}>
                <div onClick={toggleSidebar} className="relative cursor-pointer group/brand z-30">
                    <Hexagon className={`w-10 h-10 text-primary fill-current transition-all duration-500 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
                </div>

                {isExpanded && (
                    <div onClick={(e) => handleNavigation('/', e)} className="ml-6 flex flex-col overflow-hidden whitespace-nowrap animate-fade-in cursor-pointer group/text">
                        <span className="font-black text-2xl tracking-tighter text-white uppercase italic leading-none group-hover/text:text-primary transition-colors">Samefield</span>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-bold text-primary tracking-[0.4em] uppercase leading-none italic">Sports</span>
                        </div>
                    </div>
                )}
            </div>

            {/* NAVIGATION MODULE */}
            <nav className="flex-1 flex flex-col gap-2 w-full px-4 z-20">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.name}
                            onClick={(e) => handleNavigation(item.path, e)}
                            className={`
                                relative cursor-pointer flex items-center ${isExpanded ? 'justify-start px-6' : 'justify-center px-0'} py-4 rounded-[20px] transition-all duration-300 group/item overflow-hidden border
                                ${isActive
                                    ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]'
                                    : 'text-text-muted hover:text-white hover:bg-white/[0.03] border-transparent hover:border-white/5'}
                            `}
                        >
                            <div className="relative z-20">
                                <item.icon className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ${isActive ? 'text-black' : 'group-hover/item:text-white'}`} />
                            </div>

                            {isExpanded && (
                                <div className="ml-6 flex flex-col animate-fade-in">
                                    <span className={`font-bold text-sm uppercase tracking-widest ${isActive ? 'text-black' : 'text-white'}`}>{item.name}</span>
                                    {!isActive && <span className="text-[9px] font-medium text-text-muted uppercase tracking-widest mt-0.5 group-hover/item:text-white/60 transition-colors">{item.desc}</span>}
                                </div>
                            )}

                            {/* ACTIVE INDICATOR (Simple Dot) */}
                            {isActive && !isExpanded && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* FOOTER TOGGLE */}
            <div className={`mt-auto pb-8 w-full px-4 z-20 flex flex-col gap-8 ${isExpanded ? '' : 'items-center'}`}>
                <button
                    onClick={toggleSidebar}
                    className={`p-4 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 group/toggle ${isExpanded ? 'w-full' : 'w-14'}`}
                >
                    {isExpanded ? <ChevronLeft className="w-5 h-5 mx-auto" /> : <Menu className="w-5 h-5 mx-auto" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
