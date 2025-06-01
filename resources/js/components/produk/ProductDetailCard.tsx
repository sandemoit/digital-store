import React from 'react';
import Rating from './Rating';
import { router, usePage } from '@inertiajs/react';
import { addToCart } from '@/utils/cartLocal';
import { Eye, MessageSquareMore, Download, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import RupiahFormatter from '../ui/rupiahFormat';
import axios from 'axios';
import { SharedData } from '@/types';

interface ProductDetailCardProps {
  produk: any;
  hasPurchased: boolean;
  canDownload: boolean;
}

export default function ProductDetailCard({
  produk,
  hasPurchased,
  canDownload
}: ProductDetailCardProps) {
  const { auth } = usePage<SharedData>().props;

  const demo = () => {
    window.open(produk.link_demo, '_blank');
  }

  const handleDownload = () => {
    if (!canDownload) return;

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = produk.file_url;
    link.download = produk.name || 'download';

    // Append to the DOM (required for Firefox)
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  const handleAddToCart = async () => {
    try {
      if (auth.user) {
        // Jika user sudah login, simpan ke database via API
        const response = await axios.post(route('cart.add', { productId: produk.id }));

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

    router.visit(route('cart.index'));
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

        {/* Purchase status indicator */}
        {auth.user && hasPurchased && (
          <div className="mb-3 p-2 bg-green-50 text-green-700 rounded-sm text-sm">
            {canDownload
              ? "Anda telah membeli produk ini dan dapat mengunduhnya"
              : "Anda telah membeli produk ini"}
          </div>
        )}

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
            <span>{new Intl.DateTimeFormat('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(produk.updated_at))}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Rating:</span>
            <Rating value={(produk.ulasan_avg_rating !== null && produk.ulasan_avg_rating !== undefined)
              ? parseFloat(produk.ulasan_avg_rating)
              : 0} />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mt-2 w-full">
            <button
              onClick={handleChatAdmin}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm flex items-center justify-center gap-1"
            >
              <MessageSquareMore size={16} />
              Chat Admin
            </button>
            <button
              onClick={demo}
              className="hover:bg-orange-500 hover:text-white text-black border-2 border-orange-500 px-4 py-2 rounded-sm w-full flex items-center justify-center gap-1"
            >
              <Eye size={16} className='text-black hover:text-white' />
              Live Preview
            </button>
          </div>

          {/* Download or Buy button based on purchase status */}
          {canDownload ? (
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm flex items-center justify-center gap-1"
            >
              <Download size={16} />
              Unduh Produk
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-sm flex items-center justify-center gap-1"
              disabled={hasPurchased}
            >
              <ShoppingCart size={16} />
              {hasPurchased ? 'Produk Telah Dibeli' : 'Beli Sekarang'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}