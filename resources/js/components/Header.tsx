import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import useCartCount from '@/hooks/carCount';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

interface HeaderProps {
    scrolled: boolean;
}

export default function Header({ scrolled }: HeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const cartCount = useCartCount();

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm py-3" : "bg-white py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo - Shared between desktop and mobile */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center rounded mr-2">
                                <div className="h-4 w-4 bg-white transform rotate-45"></div>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">
                                Sans<span className="text-orange-600">Store</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Header */}
                    <DesktopHeader auth={auth} cartCount={cartCount} />

                    {/* Mobile Header */}
                    <MobileHeader
                        auth={auth}
                        cartCount={cartCount}
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                    />
                </div>
            </div>
        </header>
    );
}