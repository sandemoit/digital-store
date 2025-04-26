import React, { useState } from "react";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "@inertiajs/react";

const LatestProducts = () => {
  // Contoh data produk terbaru
  const latestProducts = [
    {
      id: 1,
      title: "Web Pengumuman Kelulusan Sekolah",
      category: "Aplikasi Website",
      price: 0,
      rating: 4.8,
      reviews: 124,
      image: "https://picsum.photos/400/300?random=1",
      featured: true,
      linkDemo: "https://demo.kodinger.com/announcement",
    },
    {
      id: 2,
      title: "E-Commerce Landing Page",
      category: "Template Website",
      price: 0,
      rating: 4.7,
      reviews: 98,
      image: "https://picsum.photos/400/300?random=2",
      linkDemo: "https://demo.kodinger.com/ecommerce",
    },
    {
      id: 3,
      title: "Business Card Templates",
      category: "Graphic Design",
      price: 19,
      rating: 4.5,
      reviews: 75,
      image: "https://picsum.photos/400/300?random=3",
      linkDemo: "",
    },
    {
      id: 4,
      title: "Social Media Kit",
      category: "Marketing",
      price: 29,
      rating: 4.6,
      reviews: 87,
      image: "https://picsum.photos/400/300?random=4",
      linkDemo: "",
    },
    {
      id: 5,
      title: "Portfolio WordPress Theme",
      category: "WordPress",
      price: 59,
      rating: 4.9,
      reviews: 156,
      image: "https://picsum.photos/400/300?random=5",
      featured: true,
      linkDemo: "https://demo.kodinger.com/portfolio",
    },
    {
      id: 6,
      title: "Mobile App UI Kit",
      category: "UI/UX",
      price: 69,
      rating: 4.8,
      reviews: 143,
      image: "https://picsum.photos/400/300?random=6",
      linkDemo: "",
    },
  ];

  // State untuk filter kategori
  const [activeFilter, setActiveFilter] = useState("all");

  // Daftar filter kategori unik
  const categories = ["all", ...new Set(latestProducts.map(item => item.category))];

  // Produk yang sudah difilter
  const filteredProducts = activeFilter === "all"
    ? latestProducts
    : latestProducts.filter(product => product.category === activeFilter);

  return (
    <section className="py-16 container mx-auto lg:max-w-6xl">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h6 className="text-orange-600 font-semibold mb-2">KOLEKSI DIGITAL</h6>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Produk Terbaru Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan produk digital premium terbaru kami untuk membantu meningkatkan bisnis dan proyek kreatif Anda.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-10 gap-2">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === category
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {category === "all" ? "Semua" : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-medium px-2 py-1 rounded-md z-10">
                    Featured
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors">
                    <Heart size={18} />
                  </button>
                  <Link href={product.linkDemo} className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors">
                    <Eye size={18} />
                  </Link>
                  <button className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-3">
                  <span className="text-sm text-orange-600 font-medium">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-orange-600 transition-colors">
                  <a href={`/product/${product.id}`}>{product.title}</a>
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
                    {product.price === 0 ? 'Free' : `$${product.price}`}
                  </span>
                  <button className="flex items-center justify-center bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white rounded-lg p-2 transition-colors duration-300">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 border border-orange-600 text-orange-600 rounded-lg transition-colors duration-300 hover:bg-orange-600 hover:text-white font-medium">
            Lihat Lebih Banyak
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
