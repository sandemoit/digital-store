import { useState, useEffect } from "react";
import GuestLayout from "@/layouts/guest-layout";
import { Filter, Search, X } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ProdukAll from "@/components/aplikasi/ProdukAll";
import FilterProduk from "@/components/aplikasi/FilterProduk";

interface ProdukProps {
    produk?: any[];
}

const ProdukIndex = ({ produk = [] }: ProdukProps) => {
    const [showFilterMobile, setShowFilterMobile] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on mobile screen
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    const toggleFilterMobile = () => {
        setShowFilterMobile(!showFilterMobile);
    };

    return (
        <GuestLayout title="Produk">
            <div className="bg-gray-100 min-h-auto relative">
                <HeroSection title='Mau Cari Produk Apa?' description='Ayo pilih produk premium di Sans Store, untuk membantu meningkatkan bisnis dan proyek kreatif Anda.' />
                <div className="max-w-7xl mx-auto md:p-4 p-0">
                    {/* Mobile Filter Button */}
                    {isMobile && (
                        <div className="fixed left-4 top-20 z-30">
                            <button
                                onClick={toggleFilterMobile}
                                className="flex items-center justify-center bg-white shadow-md rounded-full p-2 text-gray-600 hover:bg-gray-50"
                                aria-label="Toggle filter"
                            >
                                <Filter size={20} />
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Filter Sidebar - Desktop: always visible, Mobile: conditionally visible */}
                        <div className={`transition-all duration-300 ease-in-out ${isMobile ? 'fixed left-0 top-0 h-full z-40 bg-white shadow-lg w-64 transform' : 'md:col-span-1 bg-white p-4 rounded-lg shadow'} ${isMobile && showFilterMobile ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''}`}>

                            {/* Mobile Filter Header */}
                            {isMobile && (
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h3 className="font-medium text-lg">Filter</h3>
                                    <button
                                        onClick={toggleFilterMobile}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}

                            {/* Filter Content */}
                            <FilterProduk />
                        </div>

                        {/* Main Content - Products */}
                        <div className="md:col-span-3">
                            <ProdukAll produk={produk} />
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile when filter is open */}
                {isMobile && showFilterMobile && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30"
                        onClick={toggleFilterMobile}
                    />
                )}
            </div>
        </GuestLayout>
    );
};

export default ProdukIndex;
