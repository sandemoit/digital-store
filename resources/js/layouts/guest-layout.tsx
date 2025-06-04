import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FooterFront from '@/layouts/footer-depan-layout';
import React from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

interface GuestLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function GuestLayout({ title = 'Sandemo.id', children }: GuestLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const { flash } = usePage<SharedData>().props;

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success('Berhasil', { description: flash.success });
    } else if (flash?.error) {
      toast.error('Gagal', { description: flash.error });
    } else if (flash?.info) {
      toast.info('Info', { description: flash.info });
    }
  }, [flash]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Head title={title}>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>

      <div className="w-full items-center justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
        {/* Header */}
        <Header scrolled={scrolled} />

        {/* Main Content */}
        <div className="pt-16">
          {children}
        </div>

        <FloatingWhatsApp
          phoneNumber="6287801751656"
          accountName="CS Sanstore"
          chatMessage="Halo! Ada yang bisa kami bantu?"
          statusMessage="Online"
          placeholder="Ketik pesan..."
          allowClickAway
          notification
          notificationSound
        />

        {/* Footer */}
        <div className="w-full bg-gray-900">
          <FooterFront />
        </div>
      </div>
    </>
  );
}
