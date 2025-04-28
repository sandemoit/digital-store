// components/Produk/ProductDetailCard.tsx
import React from 'react';
import Rating from './Rating';

interface ProductDetailCardProps {
  produk: any;
}

export default function ProductDetailCard({ produk }: ProductDetailCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-3">{produk.name}</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Kategori:</span>
            <span>{produk.kategori.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Harga:</span>
            <span>IDR {produk.harga}K</span>
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
            <Rating value={4} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 w-full">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              </svg>
              Beli
            </button>
            <button className="hover:bg-orange-600 hover:text-white text-black border-2 border-orange-600 px-4 py-2 rounded-md w-full">Demo</button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md w-full">Faq</button>
          </div>
        </div>
      </div>
    </div>
  );
}
