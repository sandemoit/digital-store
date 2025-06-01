import GuestLayout from "@/layouts/guest-layout";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle, Clipboard, Clock, Home, Receipt } from "lucide-react";

interface Transaction {
    id: number;
    order_number: string;
    subtotal: number;
    payment_fee: number;
    wallet_amount: number;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
    payment_proof?: string;
    items: Array<{
        id: number;
        quantity: number;
        price: number;
        total: number;
        product: {
            name: string;
        };
    }>;
}

interface UploadSuccessProps {
    transaction: Transaction;
}

export default function UploadSuccess({ transaction }: UploadSuccessProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID').format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <GuestLayout title="Upload Berhasil">
            <Head title="Upload Berhasil" />

            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Success Card */}
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Bukti Pembayaran Berhasil Diupload!
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Terima kasih! Bukti pembayaran untuk pesanan #{transaction.order_number} telah berhasil diterima.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-center mb-2">
                                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="font-medium text-blue-900">Sedang Diproses</span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                Tim kami sedang memverifikasi pembayaran Anda. Proses verifikasi biasanya memakan waktu 1x24 jam pada hari kerja.
                            </p>
                        </div>

                        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Detail Pesanan</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Nomor Pesanan:</span>
                                    <span className="font-medium">#{transaction.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Pembayaran:</span>
                                    <span className="font-medium">Rp{formatCurrency(transaction.total_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Menunggu Konfirmasi
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tanggal Upload:</span>
                                    <span className="font-medium">{formatDateTime(new Date().toISOString())}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <h4 className="font-medium text-yellow-900 mb-2">Langkah Selanjutnya:</h4>
                            <ul className="text-left text-yellow-800 text-sm space-y-1">
                                <li>• Kami akan memverifikasi bukti pembayaran Anda</li>
                                <li>• Notifikasi akan dikirim via email setelah verifikasi selesai</li>
                                <li>• Jika pembayaran valid, pesanan akan diproses lebih lanjut</li>
                                <li>• Hubungi customer service jika ada pertanyaan</li>
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center mb-4">
                            <Receipt className="w-5 h-5 text-gray-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Ringkasan Pesanan</h3>
                        </div>

                        <div className="space-y-3 mb-4 pb-4 border-b">
                            {transaction.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <div>
                                        <span className="font-medium">{item.product.name}</span>
                                        <span className="text-gray-500"> x {item.quantity}</span>
                                    </div>
                                    <span>Rp{formatCurrency(item.total)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rp{formatCurrency(transaction.subtotal)}</span>
                            </div>
                            {transaction.payment_fee > 0 && (
                                <div className="flex justify-between">
                                    <span>Biaya Admin</span>
                                    <span>Rp{formatCurrency(transaction.payment_fee)}</span>
                                </div>
                            )}
                            {transaction.wallet_amount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Dari Dompet</span>
                                    <span>-Rp{formatCurrency(transaction.wallet_amount)}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>Rp{formatCurrency(transaction.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Kembali ke Beranda
                        </Link>

                        <Link
                            href={route('payment.cekStatus', transaction.order_number)}
                            className="flex items-center justify-center w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Clipboard className="w-5 h-5 mr-2" />
                            Cetk Status Pembayaran
                        </Link>

                        <Link
                            href="/orders"
                            className="flex items-center justify-center w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Receipt className="w-5 h-5 mr-2" />
                            Lihat Pesanan Saya
                        </Link>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>Butuh bantuan? Hubungi customer service kami</p>
                        <p className="font-medium">WhatsApp: +62 812-3456-7890</p>
                        <p className="font-medium">Email: support@example.com</p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}