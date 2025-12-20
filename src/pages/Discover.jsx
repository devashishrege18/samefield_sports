import React, { useState } from 'react';
import { Search, MapPin, Ticket, UserPlus, ShoppingBag, Heart, Globe, Briefcase, Leaf, ArrowRight, X, Shield, Star, Rocket, CheckCircle, TrendingUp, Zap, Filter, ChevronRight, Compass } from 'lucide-react';

const DetailModal = ({ selectedItem, onClose, onConfirm }) => {
    if (!selectedItem) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-lg animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full text-white z-40 transition-all border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {selectedItem.img && (
                    <div className="h-64 overflow-hidden relative">
                        <img src={selectedItem.img} className="w-full h-full object-cover opacity-80" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    </div>
                )}

                <div className="p-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Verified</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{selectedItem.name}</h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-8">
                        {selectedItem.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        {Object.entries(selectedItem.stats).map(([key, val]) => (
                            <div key={key} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{key}</p>
                                <p className="text-xl font-bold text-white">{val}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onConfirm}
                            className="bg-white text-black hover:bg-primary hover:text-white transition-all flex-1 py-4 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            <Rocket className="w-4 h-4" />
                            {selectedItem.type === 'store_visit' ? 'Enter Store' : 'Confirm'}
                        </button>
                        <button
                            onClick={onClose}
                            className="border border-white/10 hover:bg-white/5 transition-all text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-4 shadow-2xl">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">{toast.message}</span>
            </div>
        </div>
    );
};

const Discover = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast({ message, type: 'success' });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSupportClick = async (athleteName) => {
        setSelectedItem({
            type: 'support',
            name: athleteName,
            description: `You are officially supporting ${athleteName}'s journey. Your support helps fund training and equipment.`,
            stats: { support: '2.4k fans', level: 'Rising Star' },
            img: '/assets/talent_gully_cricket_1765787655210.png'
        });
        try {
            await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ athleteId: athleteName }),
            });
        } catch (error) { console.error("Support API failed", error); }
    };

    const handleAction = async (actionType, itemName) => {
        let modalData = { type: actionType, name: itemName, description: "Loading...", stats: {} };
        if (actionType === 'store_visit') {
            modalData.description = `Welcome to the official ${itemName} collection. Explore exclusive high-performance gear.`;
            modalData.stats = { members: '150k+', products: '42 items' };
            modalData.img = (itemName || "").includes('VK18') ? '/assets/store_vk18_fitness_1765787964441.png' : '/assets/store_serena_ventures_1765787984356.png';
        } else if (actionType === 'ticket_buy') {
            modalData.description = `Secure your spot at the ${itemName}. Experience the energy of grassroots sports.`;
            modalData.stats = { availability: 'Limited', category: 'General' };
            modalData.img = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800';
        } else if (actionType === 'purchase') {
            modalData.description = `Support artisans by purchasing the ${itemName}. Handcrafted with sustainable materials.`;
            modalData.stats = { stock: 'In Stock', delivery: '3-5 Days' };
            modalData.img = '/assets/product_leather_gloves_1765788007746.png';
        } else if (actionType === 'meet_maker') {
            modalData.description = `Connecting with the artisans... View the hand-stitching process in Kashmir.`;
            modalData.stats = { tradition: '3rd Gen', impact: 'Supporting 50+ Families' };
        } else if (actionType === 'follow') {
            showToast(`You're now following ${itemName}.`);
            return;
        }
        setSelectedItem(modalData);
        try {
            await fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionType, itemName }),
            });
        } catch (error) { console.error("Action API failed", error); }
    };

    const handleConfirm = () => {
        if (!selectedItem) return;
        let msg = "";
        switch (selectedItem.type) {
            case 'support': msg = `Success! You are now supporting ${selectedItem.name}. +10 XP earned!`; break;
            case 'store_visit': msg = `Welcome! Access unlocked for ${selectedItem.name} store.`; break;
            case 'ticket_buy': msg = `Confirmed! Your spot at ${selectedItem.name} is reserved.`; break;
            case 'purchase': msg = `Ordered! Your ${selectedItem.name} will be shipped soon.`; break;
            case 'meet_maker': msg = `Connecting... Starting your journey with ${selectedItem.name}.`; break;
            default: msg = "Action processed successfully!";
        }
        showToast(msg);
        setSelectedItem(null);
    };

    return (
        <div className="space-y-16 pb-20 fade-in-section">
            <DetailModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} onConfirm={handleConfirm} />
            <Toast toast={toast} />

            {/* HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-end gap-10 px-8 md:px-12 pt-8">
                <div className="max-w-3xl">
                    <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Discover</span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-4">
                        Explore the <span className="text-white/40">Network</span>
                    </h1>
                </div>
                <div className="w-full xl:w-[400px] relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search athletes, events, gear..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 text-sm font-medium"
                    />
                </div>
            </div>

            {/* PROMOTED ATHLETES */}
            <section className="px-8 md:px-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2 block">Spotlight</span>
                        <h2 className="text-2xl font-bold text-white">Rising Athletes</h2>
                    </div>
                    <button className="text-xs font-bold text-white/60 hover:text-white transition-colors flex items-center gap-2">
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: 'Arjun K.', sport: 'Gully Cricket', location: 'Mumbai, IN', role: 'Fast Bowler', img: '/assets/talent_gully_cricket_1765787655210.png' },
                        { name: 'Sarah L.', sport: 'Wheelchair Tennis', location: 'London, UK', role: 'Seed #4', img: '/assets/talent_wheelchair_tennis_1765787672511.png' },
                        { name: 'Team Elevate', sport: 'Street Football', location: 'Lagos, NG', role: 'U-19 Squad', img: '/assets/talent_street_football_1765787693394.png' },
                        { name: 'Miguel R.', sport: 'Boxing', location: 'Bronx, NY', role: 'Amateur Champ', img: '/assets/talent_boxing_training_1765787719934.png' }
                    ].map((talent, i) => (
                        <div key={i} className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[3/4]">
                            <img src={talent.img} alt="Talent" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Top Pick</span>
                            </div>

                            <div className="absolute bottom-0 inset-x-0 p-6">
                                <h3 className="text-2xl font-bold text-white leading-none mb-2">{talent.name}</h3>
                                <p className="text-sm text-primary font-medium mb-4">{talent.sport}</p>

                                <div className="flex items-center gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSupportClick(talent.name); }}
                                        className="bg-white text-black hover:bg-primary transition-colors py-2.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider flex-1"
                                    >
                                        Support
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAction('follow', talent.name); }}
                                        className="bg-white/10 hover:bg-white hover:text-black text-white p-2.5 rounded-lg transition-colors border border-white/10"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* EVENTS LIST */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Compass className="w-6 h-6 text-primary" /> Upcoming Events
                        </h2>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Filter className="w-5 h-5 text-white/60" /></button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'District T20 Finals', loc: 'Shivaji Park, Mumbai', date: 'Sat, Aug 28 • 10:00 AM', price: '₹50', img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800' },
                            { title: 'Community Charity Run', loc: 'Hyde Park, London', date: 'Sun, Aug 29 • 07:00 AM', price: 'Free', img: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=800' },
                            { title: 'Corporate Mixed Doubles', loc: 'Downtown Arena', date: 'Fri, Sep 02 • 06:00 PM', price: '$15', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800' },
                            { title: 'Rising Stars Shootout', loc: 'Elite Sports Club', date: 'Sat, Sep 03 • 03:00 PM', price: 'Free', img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800' }
                        ].map((evt, i) => (
                            <div key={i} onClick={() => handleAction('ticket_buy', evt.title)} className="group cursor-pointer premium-card p-4 flex gap-6 items-center transition-all">
                                <div className="h-24 w-32 rounded-xl overflow-hidden relative flex-shrink-0">
                                    <img src={evt.img} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                                        <span>{evt.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">{evt.title}</h3>
                                    <p className="text-sm text-white/40 flex items-center gap-1.5 mt-1">
                                        <MapPin className="w-3.5 h-3.5" /> {evt.loc}
                                    </p>
                                </div>
                                <div className="text-right px-4">
                                    <span className="block text-xl font-bold text-white mb-1">{evt.price}</span>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{evt.price === 'Free' ? 'Join' : 'Buy'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                    {/* EXCLUSIVE DROPS */}
                    <div className="bg-white/[0.02] rounded-3xl p-8 border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <ShoppingBag className="w-4 h-4 text-primary" /> Exclusive Gear
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'VK18 Fitness Tech', owner: 'Virat Kohli', img: '/assets/store_vk18_fitness_1765787964441.png' },
                                { name: 'Serena Ventures', owner: 'Serena Williams', img: '/assets/store_serena_ventures_1765787984356.png' }
                            ].map((store, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleAction('store_visit', store.name)}
                                    className="p-4 premium-card flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                                    <img src={store.img} className="w-12 h-12 rounded-lg object-cover grayscale" alt="" />
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-0.5">{store.name}</h4>
                                        <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{store.owner}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ARTISAN HIGHLIGHT */}
                    <div className="relative group rounded-3xl overflow-hidden cursor-pointer" onClick={() => handleAction('purchase', 'Hand-Stitched Leather Gloves')}>
                        <img src="/assets/product_leather_gloves_1765788007746.png" alt="Product" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute top-4 left-4">
                            <span className="bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-3 h-3" /> Fair Trade
                            </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-xl font-bold text-white mb-2">Artisan Collection</h3>
                            <button className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-2">
                                View Product <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="bg-gradient-to-br from-white/[0.05] to-transparent rounded-3xl p-8 border border-white/5">
                        <TrendingUp className="w-8 h-8 text-primary mb-4" />
                        <h4 className="text-xl font-bold text-white mb-2">Your Impact</h4>
                        <p className="text-sm text-white/60 mb-6 leading-relaxed">Early support helps rising athletes secure funding and equipment.</p>
                        <div className="pt-6 border-t border-white/10 flex justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Supporters</p>
                                <p className="text-2xl font-bold text-white">1.4k</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Growth</p>
                                <p className="text-2xl font-bold text-primary">+24%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;
