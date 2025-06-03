import React from 'react';
import { Facebook, Twitter, Instagram, X } from 'lucide-react';

const FooterFront = () => {
    return (
        <footer className=" text-white py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Social Media Column */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6">Follow our Socials</h3>
                        <div className="flex space-x-2">
                            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="bg-stone-800 hover:bg-stone-900 text-white p-2 rounded">
                                <X size={20} />
                            </a>
                            <a href="#" className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded">
                                <Instagram size={20} />
                            </a>
                        </div>

                        {/* <div className="mt-8">
                            <div className="flex items-center mb-2">
                                <span className="font-semibold mr-2">US</span>
                                <span className="text-gray-400">English</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold mr-2">ES</span>
                                <span className="text-gray-400">Spanish</span>
                            </div>
                        </div> */}
                    </div>

                    {/* Products Column */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6">Products</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white">Tutor LMS</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">WP Mega Menu</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">WP Page Builder</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Themes</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Interactions</a></li>
                        </ul>
                    </div>

                    {/* Products Column 2 */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6">Company</h3>
                        <ul className="space-y-3">
                            <li><a href={route('kontak')} className="text-gray-400 hover:text-white">Kontak Kami</a></li>
                            <li><a href={route('syaratketentuan')} className="text-gray-400 hover:text-white">Syarat & Ketentuan</a></li>
                            <li><a href={route('kebijakanprivasi')} className="text-gray-400 hover:text-white">Kebijakan Privasi</a></li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-400">Copyright © 2025 All Rights Reserved. Design by <a href="#" className="text-white hover:text-gray-300">Sandi Maulidika</a></p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">Licence</a>
                        <span className="text-gray-600">•</span>
                        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        <span className="text-gray-600">•</span>
                        <a href="#" className="text-gray-400 hover:text-white">Affiliate Notice</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterFront;
