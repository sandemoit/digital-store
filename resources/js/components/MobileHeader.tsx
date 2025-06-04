import { Link } from '@inertiajs/react';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface MobileHeaderProps {
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    cartCount: number;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function MobileHeader({
    auth,
    cartCount,
    mobileMenuOpen,
    setMobileMenuOpen
}: MobileHeaderProps) {
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Actions - Cart and Menu Toggle */}
            <div className="flex md:hidden items-center space-x-4">
                {/* Cart Icon */}
                <Link href="/cart" className="relative">
                    <ShoppingCart size={22} className="text-gray-700" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-4 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-gray-700 focus:outline-none active:text-amber-500 hover:text-amber-500"
                    aria-label="Toggle menu"
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

            {/* Mobile Sidebar Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="absolute left-0 top-0 w-72 h-full bg-white shadow-lg flex flex-col">
                        {/* Close Button */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-medium text-gray-800">Menu</h3>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="Close menu"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Menu Items */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                            <Link
                                href={route('home')}
                                className='block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium'
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Beranda
                            </Link>

                            <Link
                                href={route('produk.index')}
                                className='block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium'
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Produk Kami
                            </Link>

                            {/* Mobile Dropdown */}
                            <div className="py-1">
                                <button
                                    onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                                    className="w-full flex justify-between items-center py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium text-left"
                                >
                                    <span>Item</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${mobileSubmenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {mobileSubmenuOpen && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        <Link
                                            href="#"
                                            className="block py-2 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Item Utama
                                        </Link>
                                        <Link
                                            href="#"
                                            className="block py-2 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Landing Page
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link
                                href={route('kontak')}
                                className='block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium'
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Kontak
                            </Link>

                            {/* User Menu Items */}
                            {auth.user ? (
                                <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
                                    <Link
                                        href={route(auth.user?.role === 'admin' ? 'admin.dashboard' : 'buyer.profile')}
                                        className='block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium'
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {auth.user?.role === 'admin' ? 'Dashboard' : 'Akun Saya'}
                                    </Link>

                                    <Link
                                        href='#'
                                        className='block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium'
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Riwayat Pembelian
                                    </Link>

                                    {auth.user.role === 'admin' && (
                                        <Link
                                            href={route('product.index')}
                                            className='block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium'
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Produk Saya
                                        </Link>
                                    )}

                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className='block py-3 px-2 rounded text-red-600 hover:bg-red-50 hover:text-red-700 font-medium text-left w-full'
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
                                    <Link
                                        href={route('login')}
                                        className="block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block py-3 px-2 rounded text-gray-700 hover:bg-gray-100 hover:text-amber-500 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
