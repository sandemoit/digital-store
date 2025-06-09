import { Monitor, Star, RefreshCcw } from "lucide-react";

const stats = [
    {
        icon: <Monitor className="w-10 h-10 text-amber-500" />,
        title: "Produk Aktif",
        value: "50+",
        description: "Produk digital aktif dan siap pakai."
    },
    {
        icon: <Star className="w-10 h-10 text-amber-500" />,
        title: "Kepuasan Pelanggan",
        value: "99%",
        description: "Tingkat kepuasan pelanggan terhadap layanan kami."
    },
    {
        icon: <RefreshCcw className="w-10 h-10 text-amber-500" />,
        title: "Update Rutin",
        value: "Weekly",
        description: "Produk diupdate rutin & dukungan support aktif."
    },
];

export default function Pengenalan() {
    return (
        <section className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="py-16 container mx-auto lg:max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {stats.map((item, index) => (
                        <div key={index} className="col-span-2 bg-white shadow-md rounded-xl p-6 text-center">
                            <div className="flex justify-center mb-3">{item.icon}</div>
                            <h6 className="text-amber-500 font-semibold mb-1">{item.title.toUpperCase()}</h6>
                            <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>
                            <p className="text-gray-600 mt-2">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
