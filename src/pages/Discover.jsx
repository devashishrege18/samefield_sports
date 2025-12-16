import React from 'react';
import { Search, MapPin, Ticket, UserPlus, ShoppingBag, Heart, Globe, Briefcase, Leaf, ArrowRight } from 'lucide-react';
import MerchandiseCard from '../components/MerchandiseCard'
import { merchandiseItems } from '../data/merchandiseData'

const Discover = () => {

    // START: Task 2 - Define the API Call Handler
    const handleSupportClick = async (athleteName) => {
        try {
            // Send POST request to the API endpoint defined at app/api/support/route.js
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send the athlete's name as the identifier (athleteId)
                body: JSON.stringify({ athleteId: athleteName }), 
            });

            const result = await response.json();

            if (response.ok) {
                // Success! The backend recorded the support.
                alert(`Support registered for ${athleteName}! ${result.message}`);
            } else {
                // Failure! Show error message from the backend.
                alert(`Error: ${result.error || 'Failed to record support.'}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert('A network error occurred.');
        }
    };
    // END: Task 2 - Define the API Call Handler


    return (
        <div className="space-y-10">

            {/* Search Header */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                <input
                    type="text"
                    placeholder="Find local matches, rising stars, or ethical gear..."
                    className="w-full bg-surface border border-surfaceHighlight rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary transition-all placeholder:text-textMuted"
                />
            </div>

            {/* Rising Talent Spotlight */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-1">Rising <span className="text-primary">Talent</span></h2>
                        <p className="text-textMuted text-sm">Discover the next generation of athletes before they go pro.</p>
                    </div>
                    <button className="text-xs font-bold text-white hover:text-primary uppercase flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { name: 'Arjun K.', sport: 'Gully Cricket', location: 'Mumbai, IN', role: 'Fast Bowler', img: '/assets/talent_gully_cricket_1765787655210.png' },
                        { name: 'Sarah L.', sport: 'Wheelchair Tennis', location: 'London, UK', role: 'Seed #4', img: '/assets/talent_wheelchair_tennis_1765787672511.png' },
                        { name: 'Team Elevate', sport: 'Street Football', location: 'Lagos, NG', role: 'U-19 Squad', img: '/assets/talent_street_football_1765787693394.png' },
                        { name: 'Miguel R.', sport: 'Boxing', location: 'Bronx, NY', role: 'Amateur Champ', img: '/assets/talent_boxing_training_1765787719934.png' }
                    ].map((talent, i) => (
                        <div key={i} className="premium-card p-0 group cursor-pointer hover:-translate-y-1 transition-transform">
                            <div className="h-40 bg-surfaceHighlight relative overflow-hidden">
                                <img src={talent.img} alt="Talent" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-3 left-3">
                                    <h3 className="font-bold text-white text-lg leading-none">{talent.name}</h3>
                                    <p className="text-xs text-primary font-bold uppercase mt-1">{talent.sport}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-surface">
                                <div className="flex items-center gap-2 text-xs text-textMuted mb-3">
                                    <MapPin className="w-3 h-3" /> {talent.location}
                                </div>
                                <div className="flex gap-2">
                                    {/* 👇 MODIFIED: Attached onClick handler for Task 2 👇 */}
                                    <button 
                                        onClick={() => handleSupportClick(talent.name)}
                                        className="flex-1 py-2 bg-primary text-black text-[10px] font-black uppercase rounded hover:bg-white transition-colors">
                                        Support
                                    </button>
                                    <button className="p-2 border border-surfaceHighlight rounded text-textMuted hover:text-white hover:border-white transition-colors"><UserPlus className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Grassroots Events */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" /> Grassroots & Local Events
                        </h2>
                        <div className="space-y-4">
                            {[
                                { title: 'District T20 Finals', loc: 'Shivaji Park, Mumbai', date: 'Sat, Aug 28 • 10:00 AM', price: '₹50', img: '/assets/thumb_fiba_basketball_1765784610870.png' },
                                { title: 'Community Charity Run', loc: 'Hyde Park, London', date: 'Sun, Aug 29 • 07:00 AM', price: 'Free', img: '/assets/thumb_olympics_gold_1765784536137.png' },
                                { title: 'Corporate Mixed Doubles', loc: 'Downtown Arena', date: 'Fri, Sep 02 • 06:00 PM', price: '$15 - Registration', img: '/assets/thumb_womens_football_1765784471060.png' }
                            ].map((evt, i) => (
                                <div key={i} className="premium-card p-5 flex flex-col md:flex-row items-center gap-6 hover:bg-surfaceHighlight/30 transition-colors">
                                    <div className="w-full md:w-20 h-20 bg-surfaceHighlight rounded-lg flex flex-col items-center justify-center border border-white/5 text-center p-2 relative overflow-hidden">
                                        <img src={evt.img} alt="Event" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                                        <span className="text-xs text-primary font-bold uppercase relative z-10">{evt.date.split('•')[0].split(',')[0]}</span>
                                        <span className="text-2xl font-black text-white relative z-10">{evt.date.split(' ')[2]}</span>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="font-bold text-white text-lg">{evt.title}</h3>
                                        <p className="text-sm text-textMuted flex items-center justify-center md:justify-start gap-1 mt-1">
                                            <MapPin className="w-3 h-3" /> {evt.loc} • <span className="text-white">{evt.date.split('•')[1]}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                                        <span className="text-lg font-black text-primary">{evt.price}</span>
                                        <button className="w-full py-2 px-4 rounded-full bg-white text-black text-xs font-black uppercase hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Ticket className="w-3 h-3" /> {evt.price === 'Free' ? 'Join' : 'Buy Ticket'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT: Ethical Marketplace */}
                <div className="space-y-8">

                    {/* Athlete Stores */}
                    <div className="premium-card p-6 border-l-4 border-l-green-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-green-500" /> Athlete Owned
                            </h3>
                            <Globe className="w-4 h-4 text-textMuted" />
                        </div>
                        <div className="space-y-4">
                            <div className="bg-surfaceHighlight/30 p-3 rounded-lg flex gap-3 cursor-pointer group hover:bg-surfaceHighlight/50 transition-colors">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                                    <img src="/assets/store_vk18_fitness_1765787964441.png" className="w-full h-full object-cover" alt="VK" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">VK18 Fitness Tech</h4>
                                    <p className="text-xs text-textMuted">Owned by Virat Kohli</p>
                                </div>
                            </div>
                            <div className="bg-surfaceHighlight/30 p-3 rounded-lg flex gap-3 cursor-pointer group hover:bg-surfaceHighlight/50 transition-colors">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                                    <img src="/assets/store_serena_ventures_1765787984356.png" className="w-full h-full object-cover" alt="SW" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">Serena Ventures</h4>
                                    <p className="text-xs text-textMuted">Owned by Serena Williams</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ethical & Artisan Showcase */}
                    {merchandiseItems.map((item) => (
                        <MerchandiseCard key={item.id} item={item} />
                    ))}


                </div>
            </div>
        </div>
    );
};

export default Discover;