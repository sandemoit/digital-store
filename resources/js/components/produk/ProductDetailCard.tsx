import React from 'react';
import Rating from './Rating';
import { router, usePage } from '@inertiajs/react';
import { addToCart } from '@/utils/cartLocal';
import { Eye, MessageSquareMore, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import RupiahFormatter from '../ui/rupiahFormat';
import axios from 'axios';
import { SharedData } from '@/types';

interface ProductDetailCardProps {
  produk: any;
}

export default function ProductDetailCard({ produk }: ProductDetailCardProps) {
  const { auth } = usePage<SharedData>().props;

  const demo = () => {
    window.open(produk.link_demo, '_blank');
  }

  const handleAddToCart = async () => {
    try {
      if (auth.user) {
        // Jika user sudah login, simpan ke database via API
        const response = await axios.post(route('cart.add', { productId: produk.id }));

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
          id: produk.id,
          quantity: 1, // default beli 1
          name: produk.name,
          harga: produk.harga,
          gambar: produk.gambar?.[0]?.path,
        });
      }
    } catch (error) {
      toast.error('Gagal', {
        description: error instanceof Error ? error.message : 'Gagal menambahkan produk ke keranjang',
      });
    }

    // router.visit(route('cart.index'));
  };

  const handleChatAdmin = () => {
    const waNumber = '6287801751656';
    const message = `Halo, saya tertarik dengan produk ${produk.name}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-sm shadow-md p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-3">{produk.name}</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Kategori:</span>
            <span>{produk.kategori.nama}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Harga:</span>
            <RupiahFormatter
              className='font-bold'
              value={produk.harga}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Terjual:</span>
            <span>{produk.transaksi_sukses_count} item</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Update:</span>
            <span>{new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(produk.updated_at))}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Rating:</span>
            <Rating value={(produk.ulasan_avg_rating !== null && produk.ulasan_avg_rating !== undefined)
              ? parseFloat(produk.ulasan_avg_rating)
              : 0} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 w-full">
            <button onClick={handleChatAdmin} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm flex items-center justify-center gap-1">
              <MessageSquareMore />
              Chat Admin
            </button>
            <button onClick={demo}
              className="hover:bg-orange-500 hover:text-white text-black border-2 border-orange-500 px-4 py-2 rounded-sm w-full flex items-center justify-center gap-1">
              <Eye className='text-black' />
              Live Preview
            </button>
          </div>
          <button onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-sm flex items-center justify-center gap-1">
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
