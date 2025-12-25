import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background text-white p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Samefield
                </Link>

                <h1 className="text-3xl font-black uppercase mb-2">Privacy Policy</h1>
                <p className="text-xs text-gray-500 mb-8">Last updated: December 2025</p>

                <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">Information We Collect</h2>
                        <p>We collect minimal information necessary to provide our service: username preferences, engagement activity (XP points, forum participation), and standard analytics data.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">How We Use Data</h2>
                        <p>Your data is used to personalize your experience, maintain leaderboards, and improve platform features. We do not sell your data to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">Cookies & Local Storage</h2>
                        <p>We use local storage to save your preferences (username, theme settings) and session information. Third-party embeds may set their own cookies.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">Data Security</h2>
                        <p>We implement reasonable security measures to protect your information. However, no internet service is 100% secure.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">Your Rights</h2>
                        <p>You may request deletion of your data at any time by contacting us. Most user data is stored locally on your device.</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
                    Questions? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
