'use client';

import { addToCart } from '@/utils/cartLocal';
import { Eye, Heart, ShoppingCart, Star, Tag, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'sonner';
import RupiahFormatter from '../ui/rupiahFormat';
import { router, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import axios from 'axios';

interface Product {
    id: number;
    title?: string;
    name?: string;
    price?: number;
    harga?: number;
    image?: string;
    gambar?: Array<{ path: string }>;
    category?: string;
    kategori?: {
        id: number;
        nama: string;
    };
    rating?: number;
    ulasan_avg_rating?: number;
    ulasan_count?: number;
    reviews?: number;
    featured?: boolean;
    desc?: string;
    deskripsi?: string;
    linkDemo?: string;
    link_demo?: string;
    is_active?: boolean;
}

interface ProductTerkaitCardProps {
    produk: Product[];
}

export default function ProdukAll({ produk }: ProductTerkaitCardProps) {
    const { auth } = usePage<SharedData>().props;

    // States
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortOption, setSortOption] = useState("default");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [maxPrice, setMaxPrice] = useState(1000);

    // Effects
    useEffect(() => {
        if (produk.length > 0) {
            const highestPrice = Math.max(...produk.map(p => p.price || p.harga || 0));
            const finalMaxPrice = highestPrice > 0 ? highestPrice : 1000;
            setMaxPrice(finalMaxPrice);
            setPriceRange([0, finalMaxPrice]);
        }
    }, [produk]);

    // Handlers
    const handleAddToCart = async (product: Product) => {
        try {
            if (auth.user) {
                const response = await axios.post(route('cart.add', { productId: product.id }));

                if (response.data.success) {
                    toast.success('Berhasil', {
                        description: response.data.message,
                    });
                } else {
                    toast.error('Gagal', {
                        description: response.data.message,
                    });
                    throw new Error(response.data.message);
                }
            } else {
                addToCart({
                    id: product.id,
                    quantity: 1,
                    name: product.title || product.name || '',
                    harga: product.price || product.harga || 0,
                    gambar: product.image || (product.gambar?.[0]?.path || '')
                });
            }
        } catch (error) {
            toast.error('Gagal', {
                description: error instanceof Error ? error.message : 'Gagal menambahkan produk ke keranjang',
            });
        }

        router.visit(route('cart.index'));
    };

    const toggleLike = (productId: number) => {
        setLikedProducts(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Utilities
    const getUniqueCategories = () => {
        const allCategories = produk.map(item => {
            if (item.kategori?.nama) return item.kategori.nama;
            return item.category || "Uncategorized";
        });
        return ["all", ...Array.from(new Set(allCategories))];
    };

    const getSortedAndFilteredProducts = () => {
        // Filter by category
        let filtered = activeFilter === "all"
            ? produk
            : produk.filter(product => {
                const productCategory = product.kategori?.nama || product.category;
                return productCategory === activeFilter;
            });

        // Filter by price range
        filtered = filtered.filter(product => {
            const price = product.price || product.harga || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Sort products
        return filtered.sort((a, b) => {
            const priceA = a.price || a.harga || 0;
            const priceB = b.price || b.harga || 0;
            const ratingA = a.ulasan_avg_rating || a.rating || 0;
            const ratingB = b.ulasan_avg_rating || b.rating || 0;
            const reviewsA = a.ulasan_count || a.reviews || 0;
            const reviewsB = b.ulasan_count || b.reviews || 0;

            switch (sortOption) {
                case "price-low": return priceA - priceB;
                case "price-high": return priceB - priceA;
                case "rating": return ratingB - ratingA;
                case "reviews": return reviewsB - reviewsA;
                default: return (b.id || 0) - (a.id || 0);
            }
        });
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Gratis';
        if (price >= 1000000) return `Rp${(price / 1000000).toFixed(1)}jt`;
        if (price >= 1000) return `Rp${(price / 1000).toFixed(0)}rb`;
        return `Rp${price}`;
    };

    const getProductImage = (product: Product) => {
        return `/storage/${product.image || product.gambar?.[0]?.path || 'placeholder.jpg'}`;
    };

    const getProductName = (product: Product) => {
        return product.title || product.name || '';
    };

    const getProductCategory = (product: Product) => {
        return product.kategori?.nama || product.category || "Uncategorized";
    };

    const getProductRating = (product: Product) => {
        const rating = product.ulasan_avg_rating || product.rating || 0;
        return parseFloat(rating.toString()).toFixed(1);
    };

    const getProductReviews = (product: Product) => {
        return product.ulasan_count || product.reviews || 0;
    };

    const getProductPrice = (product: Product) => {
        return product.price || product.harga || 0;
    };

    // Data
    const categories = getUniqueCategories();
    const displayProducts = getSortedAndFilteredProducts();

    return (
        <div className="bg-white shadow rounded-sm p-6 mb-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                    Semua Produk
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-x-4 sm:items-center">
                    {/* Sort Options */}
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-auto"
                    >
                        <option value="default">Urutan Terbaru</option>
                        <option value="price-low">Harga: Rendah ke Tinggi</option>
                        <option value="price-high">Harga: Tinggi ke Rendah</option>
                        <option value="rating">Rating Tertinggi</option>
                        <option value="reviews">Ulasan Terbanyak</option>
                    </select>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-sm transition-colors w-full sm:w-auto"
                    >
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>

                    {/* View Mode Toggle */}
                    <div className="w-full sm:w-auto flex bg-gray-100 rounded-sm">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`px-3 py-2 rounded-l-sm ${viewMode === "grid" ? "bg-amber-500 text-white" : "text-gray-700"
                                }`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`px-3 py-2 rounded-r-sm ${viewMode === "list" ? "bg-amber-500 text-white" : "text-gray-700"
                                }`}
                        >
                            List
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6">
                    {/* Category Pills */}
                    <div className="overflow-x-auto pb-4">
                        <div className="flex gap-2 min-w-max">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveFilter(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === category
                                        ? "bg-amber-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {category === "all" ? "Semua Kategori" : category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Rentang Harga: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                        </p>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min={0}
                                max={maxPrice}
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <input
                                type="range"
                                min={0}
                                max={maxPrice}
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Products Display */}
            {viewMode === "grid" ? (
                // Grid View - FIXED: Changed from grid-cols-1 to grid-cols-2 for mobile
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
                    {displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Product Image */}
                            <div className="relative overflow-hidden">
                                {product.featured && (
                                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-sm z-10">
                                        Featured
                                    </span>
                                )}
                                <LazyLoadImage
                                    src={getProductImage(product)}
                                    alt={getProductName(product)}
                                    className="w-full h-40 sm:h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Hover Actions - Hidden on mobile for better UX */}
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => toggleLike(product.id)}
                                        className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                                    >
                                        <Heart size={18} />
                                    </button>
                                    {product.link_demo && (
                                        <a
                                            href={product.link_demo}
                                            target="_blank"
                                            className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                                        >
                                            <Eye size={18} />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-3 sm:p-4">
                                <div className="mb-2">
                                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-amber-500 font-medium">
                                        <Tag size={12} className="sm:w-4 sm:h-4" />
                                        <span className="truncate">{getProductCategory(product)}</span>
                                    </span>
                                </div>

                                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 hover:text-amber-500 transition-colors line-clamp-2 h-8 sm:h-12">
                                    <a href={`/produk/${product.id}`}>{getProductName(product)}</a>
                                </h3>

                                <div className="flex items-center mb-3">
                                    <div className="flex items-center text-yellow-400 mr-2">
                                        <Star size={12} className="sm:w-4 sm:h-4" fill="currentColor" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700 ml-1">
                                            {getProductRating(product)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        ({getProductReviews(product)} ulasan)
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <RupiahFormatter
                                        className="text-sm sm:text-lg font-bold text-gray-900"
                                        value={getProductPrice(product)}
                                    />
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex items-center justify-center bg-amber-50 hover:bg-amber-500 text-amber-500 hover:text-white rounded-sm p-1.5 sm:p-2 transition-colors duration-300 shadow-sm"
                                    >
                                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // List View
                <div className="flex flex-col gap-4">
                    {displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
                        >
                            {/* Product Image */}
                            <div className="relative md:w-64 h-48">
                                {product.featured && (
                                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-sm z-10">
                                        Featured
                                    </span>
                                )}
                                <LazyLoadImage
                                    src={getProductImage(product)}
                                    alt={getProductName(product)}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-5 flex-grow flex flex-col">
                                <div className="flex justify-between mb-2">
                                    <span className="inline-flex items-center gap-1 text-sm text-amber-500 font-medium">
                                        <Tag size={14} />
                                        {getProductCategory(product)}
                                    </span>
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-sm font-medium text-gray-700 ml-1">
                                            {getProductRating(product)}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({getProductReviews(product)} ulasan)
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-amber-500 transition-colors">
                                    <a href={`/produk/${product.id}`}>{getProductName(product)}</a>
                                </h3>

                                <p className="text-sm text-gray-600 mb-auto line-clamp-2">
                                    {product.desc || product.deskripsi || ""}
                                </p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <RupiahFormatter
                                        className="text-xl font-bold text-gray-900"
                                        value={getProductPrice(product)}
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleLike(product.id)}
                                            className={`p-2 rounded-sm ${likedProducts[product.id]
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                                } hover:bg-red-500 hover:text-white transition-colors`}
                                        >
                                            <Heart size={18} fill={likedProducts[product.id] ? "currentColor" : "none"} />
                                        </button>

                                        {product.link_demo && (
                                            <a
                                                href={product.link_demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </a>
                                        )}

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-sm transition-colors"
                                        >
                                            <ShoppingCart size={18} />
                                            <span>Beli Sekarang</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results */}
            {displayProducts.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">Tidak ada produk yang ditemukan.</p>
                </div>
            )}
        </div>
    );
}