import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LatestProducts from './Landing/Home/LatestProducts';
import HeroSection from './Landing/Home/Hero';
import GuestLayout from '@/layouts/guest-layout';

interface Props {
    title?: string;
    produk?: any;
}

export default function Welcome({ title, produk }: Props) {

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
