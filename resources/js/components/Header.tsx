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
                            <img src="logo.webp" alt="Logo Sans Store" className="h-8 w-8 mr-2" />
                            <span className="text-2xl font-bold text-amber-600">
                                Sans<span className="text-amber-500"> Store</span>
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
