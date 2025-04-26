import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import LatestProducts from './landing/LatestProducts';
import HeroSection from './landing/Hero';

export default function Welcome() {
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(2);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

    // Effect untuk mendeteksi scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="w-full items-center justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
                {/* Header */}
                <header
                    className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm py-3" : "bg-white py-4"
                        }`}>
                    <div className="container mx-auto px-4 lg:max-w-6xl">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center">
                                <a href="/" className="flex items-center">
                                    <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center rounded mr-2">
                                        <div className="h-4 w-4 bg-white transform rotate-45"></div>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-800">
                                        Sandemo<span className="text-orange-600">.id</span>
                                    </span>
                                </a>
                            </div>

                            {/* Menu Desktop */}
                            <nav className="hidden md:flex items-center space-x-6">
                                <Link href='#' className='text-gray-600 hover:text-orange-600 font-medium'>
                                    Beranda
                                </Link>
                                <div className="relative group">
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-orange-600 font-medium flex items-center"
                                    >
                                        Item
                                        <ChevronDown size={16} className="ml-1" />
                                    </a>
                                    <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 ease-linear">
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                        >
                                            Item Utama
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                        >
                                            Landing Page
                                        </a>
                                    </div>
                                </div>

                                <Link href='#' className='text-gray-600 hover:text-orange-600 font-medium'>
                                    Kontak
                                </Link>
                            </nav>

                            {/* User Actions */}
                            <div className="hidden md:flex items-center space-x-6">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className='text-gray-700 hover:text-orange-600 font-medium flex items-center'>Dashboard</Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-orange-600 font-medium flex items-center"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="text-gray-700 hover:text-orange-600 font-medium flex items-center border border-gray-300 rounded-md px-2"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}

                                <a href="/cart" className="relative">
                                    <ShoppingCart size={22} className="text-gray-700" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-4 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </a>
                            </div>
                            {/* Mobile Actions */}
                            <div className="flex md:hidden items-center space-x-4">
                                {/* Cart Icon - Always visible on mobile */}
                                <a href="/cart" className="relative">
                                    <ShoppingCart size={22} className="text-gray-700" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-4 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </a>

                                {/* Mobile Menu Toggle Button */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="text-gray-700 focus:outline-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Sidebar Menu */}
                    {mobileMenuOpen && (
                        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 bg-gray-900 bg-opacity-50"
                                onClick={() => setMobileMenuOpen(false)}
                            ></div>
                            {/* Sidebar */}
                            <div className="absolute right-0 top-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                                {/* Close button */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h3 className="font-medium text-gray-800">Menu</h3>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Mobile Menu Items */}
                                <nav className="flex flex-col p-4">
                                    <Link
                                        href='#'
                                        className='text-gray-600 hover:text-orange-600 font-medium py-3 border-b border-gray-100'
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Beranda
                                    </Link>
                                    {/* Mobile Dropdown */}
                                    <div className="py-3 border-b border-gray-100">
                                        <div
                                            onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                                            className="flex justify-between items-center text-gray-600 font-medium cursor-pointer"
                                        >
                                            <span>Item</span>
                                            <ChevronDown size={16} className={`transform transition-transform ${mobileSubmenuOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {mobileSubmenuOpen && (
                                            <div className="mt-2">
                                                <Link
                                                    href="#"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Item Utama
                                                </Link>
                                                <Link
                                                    href="#"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Landing Page
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        href='#'
                                        className='text-gray-600 hover:text-orange-600 font-medium py-3 border-b border-gray-100'
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Kontak
                                    </Link>
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className='text-gray-700 hover:text-orange-600 font-medium py-3 border-b border-gray-100'
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="text-gray-700 hover:text-orange-600 font-medium py-3 border-b border-gray-100 flex items-center"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                    />
                                                </svg>
                                                Log in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="text-gray-700 hover:text-orange-600 font-medium py-3 border-b border-gray-100"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>
                        </div>
                    )}
                </header >

                {/* Hero */}
                <div className="w-full bg-gray-100">
                    <HeroSection />
                </div>

                {/* Product Section */}
                <div className="w-full bg-white">
                    <LatestProducts />
                </div>

                <div className="hidden h-14.5 lg:block"></div>
            </div >
        </>
    );
}
