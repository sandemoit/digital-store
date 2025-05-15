import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ProductDetailCard from '@/components/produk/ProductDetailCard';
import ProductImageGallery from '@/components/produk/ProductImageGallery';
import ProductTabs from '@/components/produk/ProductTabs';
import ProductSidebar from '@/components/produk/ProductSidebar';
import ProductDetailSkeleton from '@/components/produk/ProductDetailSkeleton';
import GuestLayout from '@/layouts/guest-layout';
import ProdukTerkait from '@/components/produk/ProdukTerkait';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  profile_photo_path?: string;
}

interface Reply {
  id: number;
  isi: string;
  created_at: string;
  user?: User;
}

interface Komentar {
  id: number;
  isi: string;
  created_at: string;
  user?: User;
  replies?: Reply[];
  komentar_count?: number;
}

interface Ulasan {
  id: number;
  isi: string;
  rating: number;
  created_at: string;
  user?: User;
  disukai?: number;
}

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
    komentar?: Komentar[];
    ulasan?: Ulasan[];
    deskripsi?: string;
    faq?: string;
    updated_at?: string;
    link_demo?: string;
    created_at?: string;
  };
  title?: string;
  canComment?: boolean;
  isLoggedIn?: boolean;
  userId?: number;
}

export default function Show({ produk, title, canComment, isLoggedIn, userId }: ProductDetailProps) {
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

  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const { data, setData, post, processing, reset, errors } = useForm<{
    isi: string;
    parent_id: number | null;
  }>({
    isi: '',
    parent_id: null
  });

  const submitKomentar = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('product.komentar.store', produk.id), {
      onSuccess: () => {
        reset();
        setReplyingTo(null);
      },
    });
  };

  const handleReply = (komentarId: number | null = null) => {
    setData('parent_id', komentarId);
    setReplyingTo(komentarId);
    setTimeout(() => {
      document.getElementById(`reply-form-${komentarId}`)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLike = (komentarId: number) => {
    if (!isLoggedIn) {
      alert('Silakan login untuk menyukai komentar');
      return;
    }
    post(route('komentar.like', komentarId));
  };

  return (
    <GuestLayout title={title ?? 'Detail Produk'}>
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProductImageGallery images={imageUrls} />
              <ProductTabs
                deskripsi={produk.deskripsi ?? ''}
                faq={produk.faq ?? ''}
                komentar={produk.komentar ?? []}
                ulasan={produk.ulasan ?? []}
                canComment={canComment}
                isLoggedIn={isLoggedIn}
                userId={userId}
                onReply={handleReply as any}
                onLike={handleLike}
                replyingTo={replyingTo}
                commentForm={{
                  data,
                  setData,
                  submitKomentar,
                  processing,
                  errors
                }}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <ProductDetailCard produk={produk} />
              <ProductSidebar produk={produk} />
            </div>
          </div>

          <div className="mt-6">
            <ProdukTerkait produk={produk} />
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
