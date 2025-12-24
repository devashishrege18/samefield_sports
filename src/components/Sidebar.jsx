import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlayCircle, Users, MessageSquare, Compass, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Watch', path: '/watch', icon: PlayCircle },
        { name: 'Fandom', path: '/fandom', icon: Users },
        { name: 'Forum', path: '/forum', icon: MessageSquare },
        { name: 'Discover', path: '/discover', icon: Compass },
    ];

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const handleNavigation = (path, e) => {
        e.stopPropagation(); // Prevent toggling sidebar if clicking link
        navigate(path);
    };

    return (
        <aside
            className={`hidden md:flex h-screen bg-black/90 backdrop-blur-xl border-r border-white/5 flex-col transition-all duration-500 z-20 relative flex-shrink-0 shadow-cinematic
            ${isExpanded ? 'w-64' : 'w-20'} items-center`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >

            {/* Brand / Toggle */}
            <div
                className={`flex items-center justify-center h-20 w-full mb-6 transition-colors ${isExpanded ? 'px-6 justify-start' : ''}`}
            >
                <div
                    onClick={toggleSidebar}
                    className="relative cursor-pointer hover:scale-110 transition-transform"
                >
                    <img
                        src="/assets/logo_icon.png"
                        alt="Samefield"
                        className={`w-8 h-8 object-contain transition-all duration-500 ${isExpanded ? 'scale-110' : ''} drop-shadow-[0_0_8px_rgba(245,196,0,0.5)]`}
                    />
                </div>

                {isExpanded && (
                    <div
                        onClick={(e) => handleNavigation('/', e)}
                        className="ml-2 flex flex-col overflow-hidden whitespace-nowrap animate-fade-in hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <span className="font-black text-xl tracking-tighter text-white uppercase leading-none text-gradient-gold">Samefield</span>
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase leading-none mt-1">Sports</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2 w-full px-3 z-10">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.name}
                            onClick={(e) => handleNavigation(item.path, e)}
                            title={!isExpanded ? item.name : ''}
                            className={`
                                relative z-10 cursor-pointer flex items-center ${isExpanded ? 'justify-start px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-300 group
                                ${isActive ? 'text-primary bg-primary/10 shadow-[0_0_20px_-5px_rgba(245,196,0,0.3)]' : 'text-textMuted hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_6px_rgba(245,196,0,0.5)]' : 'group-hover:scale-110'}`} />

                            {isExpanded && (
                                <span className="ml-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap overflow-hidden animate-fade-in">{item.name}</span>
                            )}

                            {/* Active Indicator Glow */}
                            {isActive && (
                                <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_theme('colors.primary')] ${isExpanded ? 'left-0' : 'left-0'}`} />
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer Toggle Hint */}
            <div className="mt-auto pb-6 w-full flex justify-center">
                <button onClick={toggleSidebar} className="p-2 text-textMuted hover:text-white transition-all icon-btn hover:bg-white/5 rounded-full">
                    {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
