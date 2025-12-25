import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-16 py-8 border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4">
                {/* Links Row */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500 mb-6">
                    <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link to="/copyright" className="hover:text-white transition-colors">Copyright</Link>
                    <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                    <Link to="/help" className="hover:text-white transition-colors">Help</Link>
                </div>

                {/* Reassurance Line */}
                <p className="text-center text-[11px] text-gray-600 mb-4">
                    Samefield Sports is a fan community platform. All streams are embedded from publicly available sources.
                </p>

                {/* Copyright */}
                <p className="text-center text-[10px] text-gray-700">
                    © {currentYear} Samefield Sports
                </p>
            </div>
        </footer>
    );
};

export default Footer;
