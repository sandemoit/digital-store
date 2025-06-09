interface UnduhProdukProps {
    unduh: Array<{
        id: number;
        name: string;
        gambar?: string;
        file_url?: string;
        harga: number;
        id_kategori: number;
        kategori?: {
            nama: string;
        };
    }>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const UnduhProduk = ({ unduh }: UnduhProdukProps) => {
    const handleDownload = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'download';

        document.body.appendChild(link)

        link.click();

        // clean up
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(fileUrl);
        }, 100)
    };

    return (
        <div className="bg-white">
            <h2 className="text-xl font-bold mb-6">Produk yang Telah Dibeli</h2>
            {unduh.length === 0 ? (
                <p className="text-gray-500">Anda belum memiliki produk yang bisa diunduh.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Produk
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Harga
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {unduh.map((produk) => (
                                <tr key={produk.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {produk.gambar && (
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={`storage/${Array.isArray(produk.gambar) ? produk.gambar[0]?.path : produk.gambar}`}
                                                        alt={produk.name}
                                                    />
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{produk.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {produk.kategori?.nama || 'Tidak ada kategori'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(produk.harga)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {produk.file_url ? (
                                            <button
                                                onClick={() => handleDownload(produk.file_url!, produk.name)}
                                                className="text-amber-500 hover:text-amber-900 font-medium cursor-pointer"
                                            >
                                                Unduh
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">Tidak tersedia</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UnduhProduk;
