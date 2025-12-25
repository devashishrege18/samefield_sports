import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, Shield, Zap } from 'lucide-react';

const Help = () => {
    const faqs = [
        {
            q: "What is Samefield Sports?",
            a: "Samefield is a fan community platform where sports enthusiasts can watch live content, participate in discussions, join voice rooms, and earn XP through engagement."
        },
        {
            q: "How do I earn XP?",
            a: "Earn XP by participating in forums, upvoting content, joining voice rooms, and engaging with the community. Check your XP in the top header."
        },
        {
            q: "Is it free to use?",
            a: "Yes, Samefield Sports is completely free. No subscription or payment required."
        },
        {
            q: "How do voice rooms work?",
            a: "Voice rooms are peer-to-peer audio spaces where fans can discuss live matches and sports. Click the Rooms button in the header to join."
        },
        {
            q: "Where does the content come from?",
            a: "We aggregate publicly available content from various sources. We don't host or store videos ourselves."
        }
    ];

    return (
        <div className="min-h-screen bg-background text-white p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Samefield
                </Link>

                <h1 className="text-3xl font-black uppercase mb-2">Help Center</h1>
                <p className="text-gray-400 mb-8">Find answers to common questions.</p>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-primary" />
                                {faq.q}
                            </h3>
                            <p className="text-sm text-gray-400 pl-6">{faq.a}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-white transition-colors">
                        <MessageSquare className="w-4 h-4" /> Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Help;
