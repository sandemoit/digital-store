import { User } from "@/types";
import { Link } from "@inertiajs/react";
import { LogOut, Settings, ShoppingBag, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface ProfileSidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const getMenuClass = (isActive: boolean) => {
  return `flex items-center p-3 rounded-lg ${isActive
    ? 'bg-orange-100 text-orange-700 font-medium'
    : 'text-gray-700 hover:bg-gray-100'}`;
};

export const ProfileSidebar = ({ user, activeTab, setActiveTab }: ProfileSidebarProps) => (
  <div className="bg-white shadow rounded-lg p-4 mb-6">
    <div className="flex flex-col items-center pb-4 border-b border-gray-200 bg-white">
      <img
        src={`https://ui-avatars.com/api/?name=${user.name}&size=64&background=f54d21&color=fff`}
        alt="Your Avatar"
        className="w-full h-full object-cover mb-2 rounded-sm"
      />
      <h3 className="text-xl font-medium">{user.name}</h3>
      <div className="text-sm text-gray-500">{user.email}</div>
    </div>
    <nav className="mt-4 space-y-2">
      <button
        className={`${getMenuClass(activeTab === 'profile')} w-full`}
        onClick={() => setActiveTab('profile')}
      >
        <UserIcon className="w-5 h-5 mr-3" />
        <span>Profil</span>
      </button>
      <button
        className={`${getMenuClass(activeTab === 'purchases')} w-full`}
        onClick={() => setActiveTab('purchases')}
      >
        <ShoppingBag className="w-5 h-5 mr-3" />
        <span>Riwayat Pembelian</span>
      </button>
      <button
        className={`${getMenuClass(activeTab === 'settings')} w-full`}
        onClick={() => setActiveTab('settings')}
      >
        <Settings className="w-5 h-5 mr-3" />
        <span>Pengaturan</span>
      </button>
      <Link
        href={route('logout')}
        method="post"
        as="button"
        className={`${getMenuClass(activeTab === 'logout')} w-full`}
        onClick={() => toast.success('Berhasil logout')}
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span>Keluar</span>
      </Link>
    </nav>
  </div>
);
