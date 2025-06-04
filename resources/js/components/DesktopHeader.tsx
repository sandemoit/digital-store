import { Link } from '@inertiajs/react';
import { ChevronDown, ShoppingCart, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface DesktopHeaderProps {
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    cartCount: number;
}

export default function DesktopHeader({ auth, cartCount }: DesktopHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
                <Link
                    href={route('home')}
                    className='text-gray-600 hover:text-amber-500 font-medium'
                >
                    Beranda
                </Link>
                <Link
                    href={route('produk.index')}
                    className='text-gray-600 hover:text-amber-500 font-medium'
                >
                    Produk Kami
                </Link>
                <Link
                    href={route('kontak')}
                    className='text-gray-600 hover:text-amber-500 font-medium'
                >
                    Kontak
                </Link>

                {/* Desktop Dropdown Menu */}
                <div
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <button
                        className="text-gray-600 hover:text-amber-500 font-medium flex items-center py-2 px-3 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                    >
                        Item
                        <ChevronDown
                            size={16}
                            className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <div
                        className={`absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-sm py-2 transition-all duration-200 ease-linear z-50 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                    >
                        <a
                            href="#"
                            className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Item Utama
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Landing Page
                        </a>
                    </div>
                </div>
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-6">
                {/* Shopping Cart */}
                <a href="/cart" className="relative">
                    <ShoppingCart size={22} className="text-gray-700 hover:text-amber-500" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-4 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </a>

                {/* User Menu or Login/Register */}
                {auth.user ? (
                    <div className="relative group">
                        <a
                            href="#"
                            className="text-gray-600 hover:text-amber-500 font-medium flex items-center"
                        >
                            <User size={20} className="mr-1" />
                            <ChevronDown size={16} className="ml-1" />
                        </a>

                        {/* User Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-sm overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-linear">
                            {/* User Profile Header */}
                            <div className="bg-amber-100 p-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                        <User size={28} className="text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">{auth.user.name}</div>
                                        <div className="text-sm text-gray-600">{auth.user.email}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                {auth.user.role === 'admin' ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('buyer.profile')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Akun Saya
                                    </Link>
                                )}

                                <Link
                                    href='#'
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Riwayat Pembelian
                                </Link>

                                {auth.user.role === 'admin' && (
                                    <Link
                                        href={route('product.index')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Produk Saya
                                    </Link>
                                )}

                                <div className="border-t border-gray-200 mt-1 pt-1 px-4 py-2">
                                    <Link
                                        href={route('logout')}
                                        onClick={() => toast.success('Berhasil logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="text-gray-700 hover:text-amber-500 font-medium flex items-center"
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
                            className="text-gray-700 hover:text-amber-500 font-medium flex items-center border border-gray-300 rounded-sm px-2"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}
