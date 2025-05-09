import React from 'react';
import { Head } from '@inertiajs/react';
import ProductDetailCard from '@/components/Produk/ProductDetailCard';
import ProductImageGallery from '@/components/Produk/ProductImageGallery';
import ProductTabs from '@/components/Produk/ProductTabs';
import ProductSidebar from '@/components/Produk/ProductSidebar';
import ProductDetailSkeleton from '@/components/Produk/ProductDetailSkeleton';
import GuestLayout from '@/layouts/guest-layout';
import ProdukTerkait from '@/components/Produk/ProdukTerkait';

interface ProductDetailProps {
  produk: {
    id: number;
    name: string;
    slug?: string;
    harga: number;
    stok: number;
    gambar: Array<{ name: string; path: string }>;
    logo?: string;
    kategori?: { name: string };
    framework?: string;
    php_version?: string;
    database?: string;
    author?: string;
    versi?: string;
    komentar?: string;
    ulasan?: string;
    deskripsi?: string;
    faq?: string;
    updated_at?: string;
    link_demo?: string;
    created_at?: string;
  };
  title?: string;
}

export default function Show({ produk, title }: ProductDetailProps) {
  if (!produk) {
    return (
      <>
        <Head title="Loading..." />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ProductDetailSkeleton />
        </div>
      </>
    );
  }

  const imageUrls = produk.gambar?.map((img) => `/storage/${img.path}`) || [];

  return (
    <>
      <GuestLayout title={title ?? 'Detail Produk'}>
        <div className="bg-gray-100 min-h-screen py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProductImageGallery images={imageUrls} />
                <ProductTabs
                  deskripsi={produk.deskripsi ?? ''}
                  faq={produk.faq ?? ''}
                  komentar='Tidak ada komentar'
                  ulasan='Tidak ada ulasan'
                />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <ProductDetailCard produk={produk} />
                <ProductSidebar produk={produk} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <ProdukTerkait produk={produk} />
              </div>
            </div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
}

