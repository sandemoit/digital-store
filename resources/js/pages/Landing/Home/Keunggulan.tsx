import {
    BookOpen,
    Infinity,
    CodeXml,
    CircleFadingArrowUp,
    UserCheck,
    ShieldCheck,
} from "lucide-react";

const features = [
    {
        icon: <CodeXml className="w-10 h-10 text-purple-500" />,
        title: "Source Code Siap Pakai",
        desc: "Langsung bisa diimplementasikan tanpa ribet setup dari awal.",
    },
    {
        icon: <BookOpen className="w-10 h-10 text-green-500" />,
        title: "Dokumentasi Lengkap",
        desc: "Setiap produk dilengkapi dokumentasi cara install & penggunaan.",
    },
    {
        icon: <CircleFadingArrowUp className="w-10 h-10 text-yellow-500" />,
        title: "Dapat Update",
        desc: "Setiap produk dapat update ke versi terbaru tanpa biaya tambahan.",
    },
    {
        icon: <UserCheck className="w-10 h-10 text-blue-500" />,
        title: "Support Developer",
        desc: "Bingung? Tenang, ada support langsung dari tim developer.",
    },
    {
        icon: <Infinity className="w-10 h-10 text-blue-600" />,
        title: "Akses Lifetime",
        desc: "Beli sekali, akses selamanya tanpa biaya tambahan.",
    },
    {
        icon: <ShieldCheck className="w-10 h-10 text-red-500" />,
        title: "Produk Berkualitas",
        desc: "Dibuat oleh developer berpengalaman dan aktif di industri.",
    },
];

export default function Keunggulan() {
    return (
        <section className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="py-16 container mx-auto lg:max-w-[1200px]">
                <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                    Keunggulan membeli produk di <span className="text-amber-500">Sans Store</span>?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className="p-6 bg-white rounded-xl shadow-md hover:bg-amber-500 hover:text-white transition-colors duration-150"
                        >
                            <div className="flex justify-center mb-3">{item.icon}</div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm mt-1">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
