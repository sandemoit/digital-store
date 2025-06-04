import { useEffect, useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  XIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappIcon,
  WhatsappShareButton,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import { toast } from 'sonner';

interface ProductSidebarProps {
  produk: any;
}

export default function ProductSidebar({ produk }: ProductSidebarProps) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <div className="bg-white rounded-sm shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Detail Produk</h2>
      <div className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Kategori</span>
            <span>{produk.kategori.nama}</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Web Server</span>
            <span>Apache & Litespeed</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Framework</span>
            <span>{produk.framework}</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">PHP Support</span>
            <span>Versi {produk.php_version}</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Database</span>
            <span>{produk.database}</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Rilis</span>
            <span>{new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(produk.created_at))}</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Diupdate</span>
            <span>{new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(produk.updated_at))}</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Versi</span>
            <span>{produk.versi}</span>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Authors</span>
            <span>{produk.author}</span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button className="w-full bg-amber-500 text-white font-medium py-2 px-4 rounded-sm">
          Bagikan
        </button>
        <div className="flex justify-center mt-4 space-x-2">
          <FacebookShareButton url={currentUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={currentUrl} title='Lihat produk ini: ' hashtags={['SandemoIndoTeknologi', 'SanStore', 'ProdukDigital']}>
            <XIcon size={32} round />
          </TwitterShareButton>
          <TelegramShareButton url={currentUrl} title='Lihat produk ini: '>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <WhatsappShareButton url={currentUrl} title='Lihat produk ini: '>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={currentUrl} title='Lihat produk ini: ' summary='Kamu bisa mendapatkan produk ini di Sandemo Indo Teknologi' source='sanstore.id'>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div >
  );
}
