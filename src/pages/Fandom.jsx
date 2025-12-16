import React from 'react';
<<<<<<< HEAD
import FandomComponent from '../components/Fandom';

const Fandom = () => {
    return <FandomComponent />;
};

export default Fandom;

=======
import { Shield, Star, Trophy, ChevronRight, Lock, Crown, Gift, Zap, Users, Play, ShoppingBag, Calendar } from 'lucide-react';

const Fandom = () => {
    return (
        <div className="space-y-10">

            {/* Header: Level & Status */}
            <section className="bg-surface rounded-2xl border border-surfaceHighlight p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                                My <span className="text-primary">Status</span>
                            </h1>
                            <p className="text-textMuted font-bold">Manage your reputation and unlock elite rewards.</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full md:w-[500px]">
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                <span className="text-white">Current: Super Fan</span>
                                <span className="text-textMuted">Next: Captain (850 pts needed)</span>
                            </div>
                            <div className="w-full h-3 bg-surfaceHighlight rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-yellow-200 w-[78%] shadow-[0_0_15px_theme('colors.primary')]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-center">
                        <div>
                            <span className="block text-4xl font-black text-white">9,150</span>
                            <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Total Points</span>
                        </div>
                        <div className="w-[1px] h-12 bg-surfaceHighlight" />
                        <div>
                            <span className="block text-4xl font-black text-white">#42</span>
                            <span className="text-[10px] text-textMuted uppercase font-bold tracking-widest">Global Rank</span>
                        </div>
                    </div>
                </div>

                {/* Tiers Visualizer */}
                <div className="grid grid-cols-4 gap-2 mt-8 md:w-2/3">
                    {['New Fan', 'Core Fan', 'Super Fan', 'Captain'].map((tier, i) => (
                        <div key={tier} className={`flex flex-col items-center gap-2 p-2 rounded-lg ${i < 3 ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i === 2 ? 'bg-primary border-primary text-black' : 'border-surfaceHighlight text-textMuted'}`}>
                                {i === 3 ? <Crown className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${i === 2 ? 'text-primary' : 'text-textMuted'}`}>{tier}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Circles & Perks */}
                <div className="lg:col-span-2 space-y-8">

                    {/* My Circles */}
                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" /> Active Circles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'Team India', type: 'Team', members: '12.5M', img: 'bg-blue-900' },
                                { name: 'Virat Kohli FC', type: 'Player', members: '8.2M', img: 'bg-red-900' },
                                { name: 'Mumbai Indians', type: 'Team', members: '5.1M', img: 'bg-blue-600' },
                                { name: 'F1 Analytics', type: 'Interest', members: '1.2M', img: 'bg-gray-800' }
                            ].map((circle, i) => (
                                <div key={i} className="premium-card p-4 flex items-center gap-4 hover:border-primary cursor-pointer group transition-all">
                                    <div className={`w-14 h-14 rounded-full ${circle.img} flex items-center justify-center font-black text-white border-2 border-white/10 group-hover:border-primary transition-colors text-lg`}>
                                        {circle.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{circle.name}</h3>
                                            <span className="text-[10px] bg-surfaceHighlight px-2 py-0.5 rounded text-textMuted uppercase font-bold">{circle.type}</span>
                                        </div>
                                        <p className="text-xs text-textMuted mt-1 font-medium">{circle.members} Members • <span className="text-green-500">Active</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Elite Perks */}
                    <section>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-primary" /> Elite Perks
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Meet & Greet Card */}
                            <div className="md:col-span-2 bg-gradient-to-r from-surface to-surfaceHighlight rounded-xl border border-primary/30 p-6 relative overflow-hidden group hover:border-primary transition-colors">
                                <div className="absolute top-0 right-0 p-3 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-bl-xl z-20">
                                    Unlocked
                                </div>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <span className="text-xs font-bold text-primary uppercase tracking-widest">Monthly Reward</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Meet The Athlete</h3>
                                        <p className="text-textMuted text-sm mt-2 max-w-sm">You are eligible for this month's virtual meet-and-greet with the Player of the Month.</p>
                                    </div>
                                    <button className="w-fit btn-primary text-sm uppercase">Claim Ticket</button>
                                </div>
                                {/* BG Decoration */}
                                <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                            </div>

                            {/* Early Access */}
                            <div className="premium-card p-6 flex flex-col justify-between border-dashed border-textMuted hover:border-primary opacity-80 hover:opacity-100 transition-all">
                                <div>
                                    <div className="w-10 h-10 bg-surfaceHighlight rounded-lg flex items-center justify-center mb-4 text-textMuted">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-white leading-tight mb-2">Early Access: Season 3 Tickets</h3>
                                    <p className="text-xs text-textMuted">Unlocks at Captain Tier</p>
                                </div>
                                <div className="mt-4 w-full bg-surfaceHighlight h-1 rounded-full">
                                    <div className="w-[85%] h-full bg-textMuted" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT: Feed & Merch */}
                <div className="space-y-8">

                    {/* Exclusive Merch */}
                    <div className="premium-card p-6 border-primary/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-primary" /> Member Drop
                            </h3>
                            <span className="text-[10px] font-bold text-black bg-primary px-2 py-0.5 rounded uppercase">Limited</span>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-3 group cursor-pointer">
                                    <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center p-2 border border-transparent group-hover:border-primary transition-colors">
                                        <div className="text-[8px] font-black text-center text-black">EXCLUSIVE GEAR</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm leading-tight group-hover:text-primary transition-colors">Signed Gold Edition Jersey</h4>
                                        <p className="text-xs text-textMuted mt-1">Only for Super Fans+</p>
                                        <span className="text-sm font-bold text-primary mt-1 block">$120.00</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-surfaceHighlight text-white text-xs font-bold uppercase rounded hover:bg-white hover:text-black transition-colors">View All Store</button>
                    </div>

                    {/* Fandom Feed */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" /> Circle Highlights
                        </h3>
                        {[
                            { title: 'Backstage: Team Huddle', circle: 'Team India', time: '10m ago' },
                            { title: 'Training: New Batting Stance', circle: 'Virat Kohli FC', time: '1h ago' },
                            { title: 'Fan Cam: Winning Moment', circle: 'Mumbai Indians', time: '2h ago' }
                        ].map((item, i) => (
                            <div key={i} className="premium-card p-3 flex gap-3 hover:bg-surfaceHighlight/50 cursor-pointer group">
                                <div className="w-24 aspect-video bg-black rounded relative flex-shrink-0 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] text-primary font-bold uppercase mb-0.5">{item.circle}</span>
                                    <h4 className="font-bold text-white text-xs leading-tight mb-1">{item.title}</h4>
                                    <span className="text-[10px] text-textMuted">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Fandom;
>>>>>>> a8252db (Done)
