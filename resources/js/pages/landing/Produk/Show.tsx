import React from 'react';
import { Head } from '@inertiajs/react';
import ProductDetailCard from '@/components/Produk/ProductDetailCard';
import ProductImageGallery from '@/components/Produk/ProductImageGallery';
import ProductTabs from '@/components/Produk/ProductTabs';
import ProductSidebar from '@/components/Produk/ProductSidebar';
import ProductDetailSkeleton from '@/components/Produk/ProductDetailSkeleton';
import AppLayout from '@/layouts/app-layout';
import GuestLayout from '@/layouts/guest-layout';

interface ProductDetailProps {
  id: any;
}

export default function Show({ id }: ProductDetailProps) {
  // In a real implementation, you would fetch the product data using the ID
  // For now, we're using dummy data as requested
  const produk = {
    id: id,
    name: 'Web Lambeturah SMM Panel Multi Provider (Global API)',
    kategori: { name: 'Web Panel' },
    harga: 599,
    stok: 112,
    logo: 'https://picsum.photos/520/520', // Add a logo path if you have one
    gambar: [
      'https://picsum.photos/900/600?random=1',
      'https://picsum.photos/900/600?random=2',
      'https://picsum.photos/900/600?random=3',
      'https://picsum.photos/900/600?random=4',
      'https://picsum.photos/900/600?random=5',
      'https://picsum.photos/900/600?random=6',
      'https://picsum.photos/900/600?random=7',
      'https://picsum.photos/900/600?random=8',
    ],
    framework: 'Laravel',
    php_version: '8.1',
    database: 'MariaDB/MySQL',
    author: 'MC Project',
    versi: '5.1.1',
    komentar: 'Belum ada komentar 😎',
    ulasan: 'Belum ada ulasan ✨',
    deskripsi: `Lambeturah SMM adalah alat pemasaran media sosial. Web ini mencakup hampir semua yang Anda butuhkan untuk memudahkan pemasaran digital sosial. Website ini memiliki layanan yang terbaik untuk setiap platform media sosial dan karenanya merupakan platform yang sangat terpercaya. Baik itu like, pengikut, view, atau bahkan ketertarikan umum dari lalu lintas situs web. Lambeturah dapat menghasilkan semuanya, dan dengan harga yang tidak menguras kantong Anda.`,
    faq: `Q: Apakah support update? \nA: Iya, akan ada pembaruan minor.`,
    rilis: '29 Jun 2020',
    updated_at: '25 Jul 2024',
  };

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

  return (
    <>
      <GuestLayout title="Product Detail">
        <div className="bg-gray-100 min-h-screen py-6">
          <div className="max-w-7xl mx-auto px-4">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProductImageGallery images={produk.gambar} />
                <ProductTabs deskripsi={produk.deskripsi} faq={produk.faq} komentar={produk.komentar} ulasan={produk.ulasan} />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <ProductDetailCard produk={produk} />
                <ProductSidebar produk={produk} />
              </div>
            </div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
}
