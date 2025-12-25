import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-background text-white p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Samefield
                </Link>

                <h1 className="text-3xl font-black uppercase mb-2">Terms of Use</h1>
                <p className="text-xs text-gray-500 mb-8">Last updated: December 2025</p>

                <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing Samefield Sports, you agree to these terms. If you disagree with any part, please discontinue use of our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">2. Service Description</h2>
                        <p>Samefield Sports is a community platform that aggregates publicly available sports content and provides fan engagement features including forums, live chat, and voice rooms. We do not host, store, or stream video content directly.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">3. User Conduct</h2>
                        <p>Users are expected to engage respectfully. Harassment, hate speech, spam, and illegal activity are prohibited and may result in account termination.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">4. Content Responsibility</h2>
                        <p>User-generated content (posts, comments, voice discussions) remains the responsibility of individual users. Samefield Sports reserves the right to moderate and remove content that violates our guidelines.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">5. Limitation of Liability</h2>
                        <p>Samefield Sports is provided "as is" without warranties. We are not liable for any damages arising from platform use or third-party content accessed through our service.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">6. Changes to Terms</h2>
                        <p>We may update these terms periodically. Continued use after changes constitutes acceptance of the new terms.</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
                    Questions? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
                </div>
            </div>
        </div>
    );
};

export default Terms;
