// components/Produk/ProductDetailCard.tsx
import React from 'react';
import Rating from './Rating';
import { router } from '@inertiajs/react';
import { addToCart } from '@/utils/cartLocal';

interface ProductDetailCardProps {
  produk: any;
}


export default function ProductDetailCard({ produk }: ProductDetailCardProps) {
  const demo = () => {
    window.open(produk.linkDemo, '_blank');
  }

  const handleAddToCart = async () => {
    addToCart({
      id: produk.id,
      quantity: 1, // default beli 1
      name: produk.name,
      harga: produk.harga,
      gambar: produk.gambar[0],
    });

    router.visit(route('cart.index'));
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-3">{produk.name}</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Kategori:</span>
            <span>{produk.kategori.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Harga:</span>
            <span>IDR {produk.harga.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Terjual:</span>
            <span>{produk.stok} item</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Update:</span>
            <span>{produk.updated_at}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Rating:</span>
            <Rating value={3} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 w-full">
            <button onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-1">
              Beli Sekarang
            </button>
            <button onClick={demo}
              className="hover:bg-orange-600 hover:text-white text-black border-2 border-orange-600 px-4 py-2 rounded-md w-full flex items-center justify-center gap-1">
              Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
