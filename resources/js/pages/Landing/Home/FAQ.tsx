const faqs = [
    {
        question: "Setelah beli produk, gimana cara download-nya?",
        answer:
            "Setelah pembayaran dikonfirmasi, kamu akan langsung mendapatkan link download via dashboard atau email.",
    },
    {
        question: "Apakah produk ini bisa digunakan untuk proyek klien?",
        answer:
            "Bisa banget! Semua produk kami sudah include lisensi komersial, jadi kamu bebas pakai untuk client project.",
    },
    {
        question: "Kalau ada error atau bingung setup, bisa minta bantuan?",
        answer:
            "Tentu! Kami menyediakan support via WhatsApp atau email untuk bantu install, setup, atau debugging ringan.",
    },
    {
        question: "Apakah produk akan diupdate?",
        answer:
            "Ya. Kami rutin update produk untuk perbaikan bug atau penambahan fitur baru. Kamu akan dapat notifikasi kalau ada versi terbaru.",
    },
];

export default function Faqs() {
    return (
        <section className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="py-16 container mx-auto lg:max-w-[1200px]">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Pertanyaan Umum</h2>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="border border-gray-200 bg-white rounded-lg overflow-hidden"
                        >
                            <details className="p-4">
                                <summary className="font-medium text-gray-800 cursor-pointer">
                                    {faq.question}
                                </summary>
                                <p className="mt-2 text-gray-600">{faq.answer}</p>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}