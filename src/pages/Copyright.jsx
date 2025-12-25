import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Copyright = () => {
    return (
        <div className="min-h-screen bg-background text-white p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Samefield
                </Link>

                <h1 className="text-3xl font-black uppercase mb-2">Copyright & Content</h1>
                <p className="text-xs text-gray-500 mb-8">Last updated: December 2025</p>

                <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">Our Position</h2>
                        <p>Samefield Sports is a discovery and community platform. We do not host, upload, or store video content. All streams and media are embedded from publicly available, officially shared, or user-generated sources.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">Third-Party Content</h2>
                        <p>Team names, player names, league logos, and other trademarks belong to their respective owners. Their appearance on our platform is for identification purposes only and does not imply endorsement.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">Fair Use</h2>
                        <p>Community discussions, commentary, and fan content are provided for educational and entertainment purposes under fair use principles.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">DMCA Compliance</h2>
                        <p>We respect intellectual property rights. If you believe content on our platform infringes your copyright, please contact us with details and we will review and take appropriate action promptly.</p>
                    </section>

                    <section className="bg-white/5 p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-primary mb-3">Report an Issue</h2>
                        <p className="mb-4">To submit a copyright concern or DMCA notice:</p>
                        <p className="text-gray-400">Email: <span className="text-white">legal@samefield.sports</span></p>
                        <p className="text-xs text-gray-500 mt-2">Please include: description of content, your contact info, and proof of ownership.</p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
                    Questions? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
                </div>
            </div>
        </div>
    );
};

export default Copyright;
