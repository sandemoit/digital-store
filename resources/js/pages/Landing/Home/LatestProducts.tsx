import React, { useState } from "react";
import { Star, ShoppingCart, Heart, Eye, Tag } from "lucide-react";
import { addToCart } from "@/utils/cartLocal";
import { toast } from "sonner";
import { LazyLoadImage } from "react-lazy-load-image-component";
import RupiahFormatter from "@/components/ui/rupiahFormat";
import { router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import axios from "axios";

interface LatestProdukProps {
  produk?: any[];
}

const LatestProducts = ({ produk = [] }: LatestProdukProps) => {
  const { auth } = usePage<SharedData>().props;
  const [activeFilter, setActiveFilter] = useState("all");

  // Ambil kategori unik dari produk
  const categories = ["all", ...new Set(produk.map(item => item.kategori?.nama))];

  // Filter produk sesuai kategori aktif
  const filteredProducts = activeFilter === "all"
    ? produk
    : produk.filter(product => product.kategori?.nama === activeFilter);

  const handleAddToCart = async (product: any) => {
    try {
      if (auth.user) {
        // Jika user sudah login, simpan ke database via API
        const response = await axios.post(route('cart.add', { productId: product.id }));

        if (response.data.success) {
          toast.success('Berhasil', {
            description: response.data.message,
          });
          router.visit(route('cart.index'));
        } else {
          toast.error('Gagal', {
            description: response.data.message,
          });
          throw new Error(response.data.message);
        }
      } else {
        // Jika belum login, simpan ke local storage
        addToCart({
          id: product.id,
          quantity: 1,
          name: product.name,
          harga: product.harga,
          gambar: product.gambar?.[0]?.path,
        });
        toast.success('Berhasil', {
          description: 'Produk berhasil ditambahkan ke keranjang',
        });
      }
    } catch (error) {
      toast.error('Gagal', {
        description: 'Gagal menambahkan produk ke keranjang',
      });
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8">
      <div className="py-16 container mx-auto lg:max-w-[1200px]">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h6 className="text-amber-500 font-semibold mb-2">KOLEKSI DIGITAL</h6>
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
                ? "bg-amber-500 text-white"
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
              className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-sm z-10">
                    Featured
                  </span>
                )}
                <LazyLoadImage
                  alt={product.name}
                  src={`/storage/${product.gambar?.[0]?.path}`}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                    <Heart size={18} />
                  </button>
                  {product.link_demo && (
                    <a href={product.link_demo} target="_blank" className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                      <Eye size={18} />
                    </a>
                  )}
                  <button
                    onClick={() => { handleAddToCart(product) }}
                    className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 text-sm text-amber-500 font-medium">
                    <Tag size={14} />
                    {product.kategori?.nama}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-amber-500 transition-colors line-clamp-2 h-14">
                  <a href={`/produk/${product.id}`}>{product.name}</a>
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {(product.ulasan_avg_rating !== null && product.ulasan_avg_rating !== undefined)
                        ? parseFloat(product.ulasan_avg_rating).toFixed(1)
                        : '0.0'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.ulasan_count !== null && product.ulasan_count !== undefined ? product.ulasan_count : 0} ulasan)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <RupiahFormatter
                    className="text-xl font-bold text-gray-900"
                    value={product.harga}
                  />
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center bg-amber-50 hover:bg-amber-500 text-amber-500 hover:text-white rounded-sm p-2 transition-colors duration-300 shadow-sm"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <a href={route('produk.index')} className="px-8 py-3 border border-orange-600 text-amber-500 rounded-sm transition-colors duration-300 hover:bg-amber-500 hover:text-white font-medium">
            Lihat Lebih Banyak
          </a>
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
