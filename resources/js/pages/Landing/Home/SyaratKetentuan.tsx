import GuestLayout from "@/layouts/guest-layout";

interface SyaratKetentuanProps {
    title: string;
}

export default function SyaratKetentuan({ title }: SyaratKetentuanProps) {
    return (
        <GuestLayout title={title}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Syarat & Ketentuan
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 mb-6">
                            Kami - Sans Store, menyediakan source code, tema & plugin premium yang berkaitan dengan website dan app mobile untuk Anda dengan syarat tunduk kepada Syarat & Ketentuan (Term & Conditions) berikut. Jika Anda tidak setuju dengan Syarat & Ketentuan kami, maka Anda tidak boleh menggunakan website Sans Store.
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Menggunakan layanan kami
                            </h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-6">
                                <li>Anda harus mengikuti kebijakan apa pun yang tersedia untuk Anda dalam Layanan kami.</li>
                                <li>Jangan menyalahgunakan Layanan kami. Misalnya, jangan mengganggu Layanan kami atau mencoba mengaksesnya menggunakan metode selain antarmuka dan petunjuk yang kami berikan.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Lisensi Produk
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Source Code, tema & plugin premium yang ada di website kami adalah milik cipta pribadi Sans Store dan para seller yang terdaftar di platform kami.
                                </p>
                                <p>
                                    Semua item yang tercantum dalam direktori kami dikembangkan oleh pengembang pihak pertama (Sans Store) dan pihak kedua (seller) lalu didistribusikan melalui Sans Store dengan persetujuan dari para seller atau author. Kami bekerja sama dengan para seller untuk menyediakan produk berkualitas dan menawarkan layanan dukungan terbatas sesuai dengan kebijakan yang berlaku.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Kebijakan Pengembalian
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Kami mempertimbangkan pengembalian dana dalam waktu 30 hari setelah pembelian berdasarkan kasus per kasus dan tidak menawarkan pengembalian uang tanpa syarat. Karena meningkatnya penipuan di industri (membeli produk dan kemudian meminta pengembalian dana untuk mendapatkan produk secara gratis), kami hanya memberikan pengembalian dana dalam kasus tertentu.
                                </p>
                                <p>
                                    Produk yang kami sediakan adalah unduhan digital, dan kami tidak dapat membatasi penggunaannya setelah mengunduh. Oleh karena itu, pengembalian dana hanya akan dipertimbangkan dalam waktu 30 hari setelah tanggal pembelian.
                                </p>
                                <p>
                                    Namun, Anda harus terlebih dahulu menghubungi dukungan teknis kami. Kami selalu mencoba yang terbaik untuk memecahkan masalah untuk pelanggan kami dan kami pasti akan mengeluarkan pengembalian dana jika kami tidak dapat membantu pelanggan untuk menyelesaikannya.
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-green-600 mb-3">
                                    Pengembalian dana AKAN diberikan jika:
                                </h3>
                                <ol className="text-gray-700 space-y-2 list-decimal pl-6">
                                    <li>Produk benar-benar tidak dapat digunakan atau produk memiliki batasan lisensi yang membuat produk tidak dapat digunakan dan tim dukungan kami tidak dapat membantu Anda</li>
                                    <li>Anda telah menghubungi layanan dukungan, tetapi belum menerima dukungan sesuai dengan Kebijakan Dukungan</li>
                                </ol>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-red-600 mb-3">
                                    Pengembalian dana TIDAK akan diberikan jika:
                                </h3>
                                <ol className="text-gray-700 space-y-2 list-decimal pl-6">
                                    <li>Anda belum menghubungi tim dukungan kami di situs web dan hanya meminta pengembalian dana setelah pembelian</li>
                                    <li>Anda belum memberikan bukti yang cukup bahwa produk tidak berfungsi (Kecuali bug dari developernya) dan menolak untuk bekerja sama dengan tim dukungan kami</li>
                                    <li>Anda membuat kesalahan dan membeli bukan yang Anda butuhkan atau Anda hanya berubah pikiran</li>
                                    <li>Anda tidak lagi membutuhkan produk setelah Anda mengunduhnya misalnya karena Anda membeli produk secara tidak sengaja atau Anda membeli versi resmi dari pengembang</li>
                                    <li>Anda tidak memiliki keahlian yang cukup untuk menggunakan produk. Anda belum membaca dokumentasi dari pengembang dengan cermat dan tidak dapat menginstal atau mengonfigurasi produk yang diunduh dengan benar</li>
                                    <li>Produk tidak kompatibel dengan WordPress, plugin, server web, atau lingkungan lainnya</li>
                                    <li>Produk tidak memenuhi harapan Anda. Anda harus meninjau halaman penjualan dan mengajukan pertanyaan untuk menghilangkan kebingungan sebelum membeli</li>
                                    <li>Produk menampilkan pesan bahwa Anda perlu memasukkan kunci lisensi atau mengaktifkannya untuk menerima pembaruan otomatis, dan tidak ada batasan lisensi lainnya</li>
                                    <li>Anda merusak situs Anda selama pemasangan produk atau kehilangan data</li>
                                    <li>Sudah melebihi 30 hari periode pengembalian dana, setelah pembelian</li>
                                </ol>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Kebijakan Dukungan
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Kebijakan Dukungan ini menjelaskan bagaimana kami menyediakan layanan dukungan kami kepada Anda setelah pembelian Anda.
                                </p>
                                <p>
                                    Kami hanya memberikan dukungan untuk produk yang Anda beli di Sans Store. Untuk mendapatkan dukungan teknis, langkah pertama adalah dengan memeriksa Dokumentasi kami. Harap pastikan bahwa Anda telah mempelajari dokumentasi produk dan merujuk ke Dokumentasi sebelum chat support.
                                </p>
                                <p>
                                    Dukungan melalui Chat Support yang dibuka dari situs web kami (di kanan bawah). Kami usahakan secepatnya dalam memberikan jawaban, tetapi setiap permintaan dukungan akan ditambahkan ke antrian dukungan, dan akan diproses segera setelah staff kami tersedia. Kami memberikan dukungan teknis HANYA melalui sistem Email atau WhatsApp Store Sandemo (Sans Store). Chat Support adalah satu-satunya cara untuk mengakses dukungan teknis.
                                </p>
                                <p>
                                    Permintaan dukungan akan diproses pada hari kerja dari pukul 9:00 - 18:00 WIB sesuai urutan penerimaannya. Harap dicatat bahwa sebagian besar dari mereka ditangani dalam 24 jam - 48 jam, tetapi terkadang (dalam kasus yang sangat belakang dan rumit) Anda harus menunggu 3-5 hari kerja untuk tanggapan kami. Tentu saja, kami selalu ingin memberikan dukungan kami kepada Anda secepat mungkin. Namun, mohon dimaklumi, kami juga perlu menyeimbangkan pekerjaan dan kehidupan kami.
                                </p>
                                <p>
                                    Harap dicatat bahwa dalam beberapa kasus untuk memecahkan masalah teknis Anda harus memberi kami akses WordPress dan CPanel (Jika hanya Anda menginginkan kami melakukannya). Kami pasti menjaga kerahasian akses tersebut, sehingga kami tidak bertanggung jawab atas kerusakan yang disebabkan oleh kebocoran informasi penting. Jadi kami sangat menyarankan Anda untuk mengubah kredensial akun WP-admin dan Cpanel Anda sebelum mengirimkannya kepada kami dan untuk mengubah kembali detail tersebut setelah masalah Anda teratasi.
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                                    Apa yang dicakup oleh layanan dukungan kami:
                                </h3>
                                <ol className="text-gray-700 space-y-2 list-decimal pl-6">
                                    <li>Pendampingan Install</li>
                                    <li>Menjawab pertanyaan teknis tentang produk</li>
                                    <li>Pendampingan bantuan impor data demo</li>
                                    <li>Dukungan umum WordPress/Source Code terkait dengan produk</li>
                                    <li>Instalasi dasar produk</li>
                                </ol>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Kebijakan Privacy
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Setiap informasi yang dikirimkan oleh pembeli akan digunakan semata-mata untuk tujuan menyelesaikan transaksi, mengirimkan produk, menginformasikan tentang rilis produk baru, dan mengatasi masalah layanan pelanggan.
                                </p>
                                <p>
                                    Dengan mendaftar di situs web ini, Anda memberikan persetujuan untuk menerima pesan melalui email (berlangganan buletin). Jika Anda ingin berhenti menerima pesan ini, harap beri tahu kami. Setelah menerima tanggapan Anda, kami akan menghapus alamat email Anda dari milis dalam waktu 2x24 jam.
                                </p>
                                <p>
                                    Versi lengkap dari kebijakan privasi dapat ditemukan di halaman ini: <a href={route('kebijakanprivasi')} className="underline text-blue-500">Kebijakan Privasi</a>.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Jaminan & Keamanan
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Kami menjamin bahwa setiap produk digital yang ditawarkan di situs web dibeli secara resmi dari pengembang dan tidak mengandung malware, virus, atau iklan apa pun. Namun, kami tidak memberikan jaminan apa pun kepada Anda bahwa produk yang ditawarkan di situs web ini akan berfungsi persis seperti yang Anda inginkan atau akan kompatibel dengan semua komponen, tema, dan plugin pihak ketiga.
                                </p>
                                <p>
                                    Jika Anda memerlukan bantuan dengan instalasi, konfigurasi, penggunaan produk atau jika Anda memiliki masalah teknis, kami menjamin untuk memberikan Anda dukungan teknis profesional sesuai dengan Kebijakan Dukungan kami.
                                </p>
                                <p>
                                    Kami juga memberikan jaminan fungsi produk selama 30 hari. Ini berarti bahwa jika Anda mengunduh produk dan tidak berfungsi, tetapi belum melewati 30 hari, Anda dapat menghubungi staff dukungan di situs web dan memberikan waktu kami menyelesaikan masalah sehingga berfungsi kembali.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Batasan Tanggung Jawab
                            </h2>
                            <p className="text-gray-700">
                                Dalam keadaan apa pun Sans Store tidak bertanggung jawab atas segala kerusakan langsung, tidak langsung, khusus, insidental, atau konsekuensial, termasuk, namun tidak terbatas pada, hilangnya data atau keuntungan, yang timbul dari penggunaan, atau ketidakmampuan untuk menggunakan, materi pada situs, bahkan jika kami atau perwakilan resmi telah diberitahu tentang kemungkinan kerusakan tersebut. Jika penggunaan Anda atas materi dari situs ini mengakibatkan kebutuhan untuk servis, perbaikan, atau koreksi peralatan atau data, Anda menanggung semua biayanya.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Perubahan Syarat & Ketentuan
                            </h2>
                            <p className="text-gray-700">
                                Kami berhak untuk mengubah atau memodifikasi Syarat dan Ketentuan saat ini tanpa pemberitahuan sebelumnya. Kami juga berhak mengubah ketentuan penjualan produk digital dan berlangganan. Kami tidak bertanggung jawab kepada Anda atau pihak ketiga mana pun jika terjadi perubahan kondisi penjualan produk digital atau langganan.
                            </p>
                        </section>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                Terakhir diperbarui: 3 Juni 2025
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
