'use client';

import { Search } from "lucide-react";

export default function FilterProduk() {
    return (
        <div className="p-2">
            <div className="relative w-full border border-gray-300 rounded transition-[border] focus:outline-none focus:border-2 focus:border-gray-700">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search size={20} className="text-gray-700" />
                </div>
                <input
                    type="text"
                    placeholder="Cari produk digital..."
                    className="pl-12 w-full px-5 py-4 bg-white "
                />
            </div>

            <hr className="my-3 border-t border-gray-300" />

            {/* Kategori Filter */}
            <h3 className="font-medium mb-4">Filter Produk</h3>
            <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Kategori</h4>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <input id="cat-1" type="checkbox" className="h-4 w-4 text-amber-500 border-gray-300 rounded" />
                        <label htmlFor="cat-1" className="ml-2 text-sm text-gray-700">Elektronik</label>
                    </div>
                    <div className="flex items-center">
                        <input id="cat-2" type="checkbox" className="h-4 w-4 text-amber-500 border-gray-300 rounded" />
                        <label htmlFor="cat-2" className="ml-2 text-sm text-gray-700">Fashion</label>
                    </div>
                    <div className="flex items-center">
                        <input id="cat-3" type="checkbox" className="h-4 w-4 text-amber-500 border-gray-300 rounded" />
                        <label htmlFor="cat-3" className="ml-2 text-sm text-gray-700">Makanan & Minuman</label>
                    </div>
                </div>
            </div>

            {/* Harga Filter */}
            <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Rentang Harga</h4>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Rating</h4>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <input id="rate-5" type="checkbox" className="h-4 w-4 text-amber-500 border-gray-300 rounded" />
                        <label htmlFor="rate-5" className="ml-2 text-sm text-gray-700">5 Bintang</label>
                    </div>
                    <div className="flex items-center">
                        <input id="rate-4" type="checkbox" className="h-4 w-4 text-amber-500 border-gray-300 rounded" />
                        <label htmlFor="rate-4" className="ml-2 text-sm text-gray-700">4 Bintang & ke atas</label>
                    </div>
                    <div className="flex items-center">
                        <input id="rate-3" type="checkbox" className="h-4 w-4 text-amber-500 border-gray-300 rounded" />
                        <label htmlFor="rate-3" className="ml-2 text-sm text-gray-700">3 Bintang & ke atas</label>
                    </div>
                </div>
            </div>

            <button className="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition">
                Terapkan Filter
            </button>
        </div>
    )
}
