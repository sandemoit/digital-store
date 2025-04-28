import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import LatestProducts from './landing/LatestProducts';
import HeroSection from './landing/Hero';
import FooterFront from '@/layouts/footer-depan-layout';
import GuestLayout from '@/layouts/guest-layout';

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
            <GuestLayout title='Global'>
                {/* Hero */}
                <div className="w-full bg-gray-100">
                    <HeroSection />
                </div>

                {/* Product Section */}
                <div className="w-full bg-gray-50">
                    <LatestProducts />
                </div>
            </GuestLayout>
        </>
    );
}
