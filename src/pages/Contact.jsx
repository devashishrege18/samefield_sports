import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-background text-white p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Samefield
                </Link>

                <h1 className="text-3xl font-black uppercase mb-2">Contact Us</h1>
                <p className="text-gray-400 mb-8">We'd love to hear from you.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <Mail className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">General Inquiries</h3>
                        <p className="text-sm text-gray-400 mb-3">For partnerships, press, or general questions</p>
                        <p className="text-primary">hello@samefield.sports</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <MessageCircle className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Support</h3>
                        <p className="text-sm text-gray-400 mb-3">Technical issues or account help</p>
                        <p className="text-primary">support@samefield.sports</p>
                    </div>
                </div>

                <div className="mt-8 bg-surface p-6 rounded-xl border border-white/10">
                    <h3 className="font-bold text-lg mb-4">Legal & Copyright</h3>
                    <p className="text-sm text-gray-400 mb-3">For DMCA notices or legal matters</p>
                    <p className="text-primary">legal@samefield.sports</p>
                </div>

                <div className="mt-12 text-center text-xs text-gray-500">
                    <p>We typically respond within 24-48 hours.</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
