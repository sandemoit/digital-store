import GuestLayout from "@/layouts/guest-layout";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { LogOut, Settings, ShoppingBag, User } from "lucide-react";
import { useState } from "react";

interface Props {
    title?: string
}

const ProfileContent = ({ user }: { user: any }) => (
    <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <div className="text-sm text-gray-500">Nama Lengkap</div>
                <div>{user.name}</div>
            </div>
            <div>
                <div className="text-sm text-gray-500">Email</div>
                <div>{user.email}</div>
            </div>
            <div>
                <div className="text-sm text-gray-500">Negara</div>
                <div>{user.location}</div>
            </div>
            <div>
                <div className="text-sm text-gray-500">Member Sejak</div>
                <div>{user.joinDate}</div>
            </div>
        </div>
    </div>
);

const dummyPurchaseHistory = [
    { id: 1, product: "eBook Desain Web Modern", date: "10 Mei 2025", price: "Rp 150.000", status: "Selesai" },
    { id: 2, product: "Template Landing Page Premium", date: "5 Mei 2025", price: "Rp 350.000", status: "Selesai" },
    { id: 3, product: "Plugin WordPress SEO", date: "28 April 2025", price: "Rp 200.000", status: "Dalam Proses" },
    { id: 4, product: "Kursus Digital Marketing", date: "15 April 2025", price: "Rp 500.000", status: "Selesai" },
];

const PurchaseHistoryContent = () => (
    <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Riwayat Pembelian</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {dummyPurchaseHistory.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-900">Unduh</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default function ProfileIndex({ title }: Props) {
    const { auth } = usePage<SharedData>().props;

    const dummyUserData = {
        name: auth.user?.name || "",
        email: auth.user?.email || "",
        avatar: "/api/placeholder/200/200",
        joinDate: auth.user?.created_at || "",
        location: "Indonesia",
        totalSales: 0,
        totalPurchases: 0
    };

    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileContent user={dummyUserData} />;
            case 'purchases':
                return <PurchaseHistoryContent />;
            default:
                return <ProfileContent user={dummyUserData} />;
        }
    };

    // Fungsi untuk menentukan kelas menu yang aktif
    const getMenuClass = (menu: any) => {
        return `flex items-center p-3 rounded-lg ${activeTab === menu
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'}`;
    };

    return (
        <GuestLayout title={title ?? 'Welcome'}>
            <div className="bg-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4">

                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white shadow rounded-lg p-4 mb-6">
                                <div className="flex flex-col items-center pb-4 border-b border-gray-200">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${dummyUserData.name}&size=64&background=0D8ABC&color=fff`}
                                        alt="Your Avatar"
                                        className="w-full h-full object-cover mb-2 rounded-sm"
                                    />
                                    <h3 className="text-xl font-medium">{dummyUserData.name}</h3>
                                    <div className="text-sm text-gray-500">{dummyUserData.email}</div>
                                </div>
                                <nav className="mt-4 space-y-2">
                                    <button
                                        className={`${getMenuClass('profile')} w-full`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        <User className="w-5 h-5 mr-3" />
                                        <span>Profil</span>
                                    </button>
                                    <button
                                        className={`${getMenuClass('purchases')} w-full`}
                                        onClick={() => setActiveTab('purchases')}
                                    >
                                        <ShoppingBag className="w-5 h-5 mr-3" />
                                        <span>Riwayat Pembelian</span>
                                    </button>
                                    <button
                                        className={`${getMenuClass('settings')} w-full`}
                                        onClick={() => setActiveTab('settings')}
                                    >
                                        <Settings className="w-5 h-5 mr-3" />
                                        <span>Pengaturan</span>
                                    </button>
                                    <button
                                        className={`${getMenuClass('logout')} w-full`}
                                        onClick={() => setActiveTab('logout')}
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        <span>Keluar</span>
                                    </button>
                                </nav>
                            </div>
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
    )
}