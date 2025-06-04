import GuestLayout from "@/layouts/guest-layout";

const title = "Kebijakan Privasi";

export default function KebijakanPrivasi() {
    return (
        <GuestLayout title={title}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Kebijakan Privasi
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <p className="text-blue-800 font-medium">
                                Alamat situs web kami adalah: <span className="font-bold">https://sansstore.id</span>
                            </p>
                        </div>

                        <div className="text-gray-700 space-y-6 mb-8">
                            <p>
                                Kebijakan Privasi ini ditulis untuk membantu Anda lebih memahami bagaimana kami mengumpulkan, menggunakan dan menyimpan informasi Anda. Karena undang-undang teknologi dan privasi selalu berubah, kami terkadang memperbarui kebijakan ini. Jika perubahan signifikan dilakukan, kami pasti akan memposting pemberitahuan di halaman beranda kami. Jika Anda terus menggunakan situs web ini setelah perubahan ini diposting, Anda setuju dengan kebijakan yang direvisi.
                            </p>
                            <p>
                                Dengan mendaftar ke salah satu produk atau layanan yang kami tawarkan (bersama-sama, disebut "Layanan") Anda menyetujui persyaratan Kebijakan Privasi ini dan, sebagaimana berlaku, Persyaratan Layanan kami. Kebijakan ini adalah perjanjian yang mengikat secara hukum antara Anda (dan klien Anda, perusahaan atau entitas lain jika Anda bertindak atas nama mereka) sebagai pengguna Layanan (disebut sebagai "Anda" atau "milik Anda") dan Sans Store dan afiliasi. Jika kami menambahkan fitur atau alat baru ke Layanan kami, mereka juga akan tunduk pada kebijakan ini.
                            </p>
                            <p>
                                Kami akan menjaga Informasi Pribadi Anda akurat, lengkap, dan terbaru dengan informasi yang Anda berikan kepada kami. Jika Anda meminta akses ke Informasi Pribadi Anda, kami akan memberi tahu Anda tentang keberadaan, penggunaan, dan pengungkapan Informasi Pribadi Anda sebagaimana diizinkan oleh hukum, dan memberi Anda akses ke informasi itu.
                            </p>
                        </div>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Data pribadi apa yang kami kumpulkan dan mengapa kami mengumpulkannya
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Dari pengunjung situs web:</h3>
                                    <p>
                                        Kami mengumpulkan informasi tentang perangkat dan browser yang Anda gunakan, koneksi jaringan, dan alamat IP Anda. Kami juga dapat menerima Informasi Pribadi saat Anda membeli produk atau membuat permintaan lain ke situs web kami.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Dari pengguna Tiket Dukungan:</h3>
                                    <p>
                                        Kami mengumpulkan nama, alamat email, dan nomor whatsapp Anda.
                                    </p>
                                </div>
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-800 mb-2">Tujuan penggunaan informasi:</h3>
                                    <p className="text-green-700">
                                        Kami menggunakan informasi ini untuk melayani akun Anda, meningkatkan Layanan kami, dan menjawab setiap pertanyaan yang mungkin Anda miliki.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Kapan kami mengumpulkan informasi ini?
                            </h2>
                            <div className="text-gray-700">
                                <p className="mb-4">
                                    Kami mengumpulkan informasi ini ketika Anda:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Mengunjungi website kami</li>
                                    <li>Berkomunikasi dengan kami melalui email</li>
                                    <li>Mengisi formulir web</li>
                                    <li>Meninggalkan komentar</li>
                                    <li>Mengirim tiket dukungan (termasuk permintaan produk baru)</li>
                                </ul>
                                <p className="mt-4">
                                    Kami juga mengumpulkan informasi tambahan yang mungkin Anda berikan kepada kami.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Penggunaan Informasi
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Kami dapat menggunakan dan mengungkapkan informasi seperti yang dijelaskan dalam halaman ini. Selain penggunaan yang dijelaskan dalam halaman ini, kami dapat menggunakan informasi untuk tujuan yang mencakup:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Pemenuhan pembelian dan administrasi</li>
                                    <li>Survei produk</li>
                                    <li>Penagihan dan audit</li>
                                    <li>Penggunaan serupa lainnya</li>
                                </ul>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                                    <p className="text-yellow-800">
                                        <strong>Komitmen kami:</strong> Kami hanya mengumpulkan, menggunakan, dan mengungkapkan informasi pribadi atau informasi non-pribadi untuk tujuan yang wajar dalam keadaan tersebut. Kami hanya menggunakan cara yang adil dan sah untuk mengumpulkan informasi. Kami berhak untuk menggunakan atau mengungkapkan kumpulan Informasi dan Informasi Kontak Bisnis dengan cara yang kami anggap pantas.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Cookies
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-blue-800 mb-2">Cookies Cart</h3>
                                        <p className="text-blue-700 text-sm">
                                            Jika Anda menambahkan produk ke keranjang sebelum login di situs kami, Anda dapat memilih untuk menyimpan produk di cookie. Ini untuk kenyamanan Anda sehingga Anda tidak perlu menambahkan produk lagi saat mengunjungi halaman keranjang. Cookie ini akan bertahan selama 30 hari.
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-purple-800 mb-2">Cookies Login</h3>
                                        <p className="text-purple-700 text-sm">
                                            Jika Anda mengunjungi halaman login kami, kami akan menetapkan cookie sementara untuk menentukan apakah browser Anda menerima cookie. Cookie ini tidak berisi data pribadi dan dibuang saat Anda menutup browser Anda.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Cookies Sesi</h3>
                                    <p className="text-gray-700">
                                        Saat Anda masuk, kami juga akan menyiapkan beberapa cookie untuk menyimpan informasi login Anda dan pilihan tampilan layar Anda. Cookie masuk bertahan selama dua hari, dan cookie opsi layar bertahan selama satu tahun. Jika Anda memilih "Remember Me", login Anda akan bertahan selama dua minggu. Jika Anda keluar dari akun Anda, cookie login akan dihapus.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Tautan Website Lain
                            </h2>
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                <p className="text-orange-800">
                                    <strong>Penting:</strong> Saat Anda mengeklik tautan di website ini dan membawa Anda ke website lain yang dioperasikan oleh perusahaan lain, Anda akan tunduk pada kebijakan privasi website perusahaan tersebut. Kami tidak bertanggung jawab atas praktik privasi atau konten dari website pihak ketiga.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Kontak Informasi
                            </h2>
                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                                <p className="text-green-800 mb-4">
                                    Jika Anda memiliki pertanyaan tentang kebijakan ini atau website kami, jangan ragu untuk menghubungi kami melalui:
                                </p>
                                <div className="space-y-2 text-green-700">
                                    <p><strong>Email:</strong> support@sansstore.id</p>
                                    <p><strong>Halaman Kontak:</strong> Melalui formulir kontak di website kami</p>
                                    <p><strong>Chat Support:</strong> Tersedia di pojok kanan bawah website</p>
                                </div>
                            </div>
                        </section>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 text-center mb-2">
                                    <strong>Terakhir diperbarui:</strong> 3 Juni 2025
                                </p>
                                <p className="text-xs text-gray-500 text-center">
                                    Kebijakan ini dapat berubah sewaktu-waktu. Perubahan signifikan akan diumumkan melalui pemberitahuan di halaman utama website.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
