'use client';

import { addToCart } from '@/utils/cartLocal';
import { Eye, Heart, ShoppingCart, Star, Tag, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ProductTerkaitCardProps {
  produk: any;
}

export default function ProdukTerkait({ produk }: ProductTerkaitCardProps) {

  const handleAddToCartOnly = async () => {
    addToCart({
      id: produk.id,
      quantity: 1, // default beli 1
      name: produk.name,
      harga: produk.harga,
      gambar: produk.gambar?.[0]?.path
    });

    toast.success('Berhasil', {
      description: 'Silahkan lanjutkan belanja atau lihat keranjang',
    });
  };

  const latestProducts = [
    {
      id: 1,
      title: "Web Pengumuman Kelulusan Sekolah",
      category: "Aplikasi Website",
      price: 0,
      rating: 4.8,
      reviews: 124,
      image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      featured: true,
      linkDemo: "https://demo.kodinger.com/announcement",
      desc: "Aplikasi siap pakai untuk pengumuman kelulusan dengan fitur pencarian dan tampilan modern"
    },
    {
      id: 2,
      title: "E-Commerce Landing Page",
      category: "Template Website",
      price: 0,
      rating: 4.7,
      reviews: 98,
      image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      linkDemo: "https://demo.kodinger.com/ecommerce",
      desc: "Template landing page untuk toko online dengan desain konversi tinggi"
    },
    {
      id: 3,
      title: "Business Card Templates",
      category: "Graphic Design",
      price: 19,
      rating: 4.5,
      reviews: 75,
      image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      linkDemo: "",
      desc: "Koleksi template kartu nama profesional dalam berbagai gaya dan format"
    },
    {
      id: 4,
      title: "Social Media Kit",
      category: "Marketing",
      price: 29,
      rating: 4.6,
      reviews: 87,
      image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      linkDemo: "",
      desc: "Paket lengkap untuk branding media sosial termasuk template post dan story"
    },
    {
      id: 5,
      title: "Portfolio WordPress Theme",
      category: "WordPress",
      price: 59,
      rating: 4.9,
      reviews: 156,
      image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      featured: true,
      linkDemo: "https://demo.kodinger.com/portfolio",
      desc: "Theme WordPress premium untuk portofolio kreatif dengan fitur gallery dan blog"
    },
    {
      id: 6,
      title: "Mobile App UI Kit",
      category: "UI/UX",
      price: 69,
      rating: 4.8,
      reviews: 143,
      image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      linkDemo: "",
      desc: "Kit UI komprehensif untuk pengembangan aplikasi mobile dengan komponen modern"
    },
  ];

  // States
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});

  // Get unique categories
  const categories = ["all", ...new Set(latestProducts.map(item => item.category))];

  // Handle liking a product
  const toggleLike = (productId: number) => {
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Sort and filter products
  const getSortedAndFilteredProducts = () => {
    // First filter
    const filtered = activeFilter === "all"
      ? latestProducts
      : latestProducts.filter(product => product.category === activeFilter);

    // Then sort
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return a.id - b.id; // default sort by id
      }
    });
  };

  const displayProducts = getSortedAndFilteredProducts();

  return (
    <div className="bg-white shadow rounded-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Produk Terkait</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sort Options */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="default">Urutan Default</option>
            <option value="price-low">Harga: Rendah ke Tinggi</option>
            <option value="price-high">Harga: Tinggi ke Rendah</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="reviews">Ulasan Terbanyak</option>
          </select>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-sm transition-colors"
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-l-lg ${viewMode === "grid" ? "bg-amber-500 text-white" : "text-gray-700"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-r-lg ${viewMode === "list" ? "bg-amber-500 text-white" : "text-gray-700"}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills - show on mobile and when filter is toggled */}
      {showFilters && (
        <div className="mb-6 overflow-x-auto pb-2">
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
      )}

      {/* Products Grid or List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-sm z-10">
                    Featured
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => toggleLike(product.id)}
                    className={`w-10 h-10 rounded-full ${likedProducts[product.id] ? 'bg-red-500 text-white' : 'bg-white text-gray-800'} flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors`}
                  >
                    <Heart size={18} fill={likedProducts[product.id] ? "currentColor" : "none"} />
                  </button>
                  {product.linkDemo && (
                    <a
                      href={product.linkDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                    >
                      <Eye size={18} />
                    </a>
                  )}
                  <button onClick={handleAddToCartOnly} className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 text-sm text-amber-500 font-medium">
                    <Tag size={14} />
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-amber-500 transition-colors line-clamp-2 h-14">
                  <a href={`/aplikasi/${product.id}`}>{product.title}</a>
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviews} ulasan)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    {product.price === 0 ? 'Gratis' : `Rp${product.price}k`}
                  </span>
                  <button className="flex items-center justify-center bg-amber-50 hover:bg-amber-500 text-amber-500 hover:text-white rounded-sm p-2 transition-colors duration-300 shadow-sm">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
            >
              {/* Product Image - Smaller in list view */}
              <div className="relative md:w-64 h-48">
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-sm z-10">
                    Featured
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info - Expanded in list view */}
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-sm text-amber-500 font-medium">
                    <Tag size={14} />
                    {product.category}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {product.rating}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.reviews} ulasan)
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-amber-500 transition-colors">
                  <a href={`/aplikasi/${product.id}`}>{product.title}</a>
                </h3>

                <p className="text-sm text-gray-600 mb-auto">{product.desc}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xl font-bold text-gray-900">
                    {product.price === 0 ? 'Gratis' : `Rp${product.price}k`}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleLike(product.id)}
                      className={`p-2 rounded-sm ${likedProducts[product.id] ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-red-500 hover:text-white transition-colors`}
                    >
                      <Heart size={18} fill={likedProducts[product.id] ? "currentColor" : "none"} />
                    </button>

                    {product.linkDemo && (
                      <a
                        href={product.linkDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <Eye size={18} />
                      </a>
                    )}

                    <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-500 text-white px-4 py-2 rounded-sm transition-colors">
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

      {/* No Results Message */}
      {displayProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Tidak ada produk yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}
