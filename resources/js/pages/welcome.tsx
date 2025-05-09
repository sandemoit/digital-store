import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LatestProducts from './landing/LatestProducts';
import HeroSection from './landing/Hero';
import GuestLayout from '@/layouts/guest-layout';

interface Props {
    title?: string;
    produk?: any;
}

export default function Welcome({ title, produk }: Props) {
    const [scrolled, setScrolled] = useState(false);

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
            <GuestLayout title={title ?? 'Welcome'}>
                {/* Hero */}
                <div className="w-full bg-gray-100">
                    <HeroSection />
                </div>

                {/* Product Section */}
                <div className="w-full bg-gray-50">
                    <LatestProducts produk={produk} />
                </div>
            </GuestLayout>
        </>
    );
}
