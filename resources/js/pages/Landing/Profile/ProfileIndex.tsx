import HeroSection from "@/components/HeroSection";
import GuestLayout from "@/layouts/guest-layout";
import { SharedData, User } from "@/types";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { ProfileContent } from "./ProfileContent";
import { PurchaseHistoryContent } from "./PurchaseHistoryContent";
import { ProfileSidebar } from "./ProfileSidebar";
import UnduhProduk from "./UnduhProduk";

interface Transaction {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: Array<{
    product?: {
      kategori?: {
        nama: string;
      };
    };
  }>;
}

interface UnduhProduk {
  id: number;
  name: string;
  gambar?: string;
  file_url?: string;
  harga: number;
  id_kategori: number;
}

interface PageProps extends SharedData {
  title?: string;
  transactions?: Transaction[];
  purchasedProducts?: UnduhProduk[];
}

export default function ProfileIndex() {
  // Ambil data dari usePage, bukan dari props
  const { auth, title, transactions, purchasedProducts = [] } = usePage<PageProps>().props;

  const UserData: User = {
    id: auth.user?.id || 0,
    name: auth.user?.name || "",
    email: auth.user?.email || "",
    role: auth.user?.role || "buyer",
    avatar: "/api/placeholder/200/200",
    email_verified_at: null,
    created_at: auth.user?.created_at || "",
    updated_at: auth.user?.updated_at || "",
  } as const;

  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent user={UserData} />;
      case 'purchases':
        return <PurchaseHistoryContent transactions={transactions} />;
      case 'unduh':
        return <UnduhProduk unduh={purchasedProducts} />;
      default:
        return <ProfileContent user={UserData} />;
    }
  };

  return (
    <GuestLayout title={title ?? 'Welcome'}>
      <HeroSection title={title} description="Lihat informasi profil dan riwayat transaksi Anda." />

      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProfileSidebar
                user={UserData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-sm shadow-md p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
