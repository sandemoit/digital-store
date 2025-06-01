import { useState } from 'react';
import {
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
    Truck,
    Home,
    Receipt,
    Download,
    Star,
    CreditCard,
    FileText
} from "lucide-react";
import GuestLayout from '@/layouts/guest-layout';

// Type definitions
interface Product {
    name: string;
    type: string;
}

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: Product;
}

interface PaymentMethod {
    name: string;
}

interface StatusBadge {
    text: string;
    color: string;
}

interface Transaction {
    id: string;
    order_number: string;
    subtotal: number;
    payment_fee: number;
    wallet_amount: number;
    total_amount: number;
    status: string;
    payment_status: string;
    status_badge: StatusBadge;
    payment_status_badge: StatusBadge;
    created_at: string;
    confirmed_at: string | null;
    payment_date: string | null;
    cancelled_at: string | null;
    payment_method: PaymentMethod | null;
    can_be_cancelled: boolean;
    is_manual_payment: boolean;
    has_payment_proof: boolean;
    payment_proof_url: string | null;
    items: OrderItem[];
}

interface Props {
    transaction?: Transaction;
}

const StatusPayment = ({ transaction }: Props) => {
    const [showInvoice, setShowInvoice] = useState(false);

    if (!transaction) {
        return <TransactionNotFound />;
    }

    const statusConfig = getStatusConfig(transaction);
    const StatusIcon = statusConfig.icon;
    const hasDigitalProducts = checkDigitalProducts(transaction.items);

    return (
        <GuestLayout title='Status Pembayaran'>
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <StatusCard
                        transaction={transaction}
                        statusConfig={statusConfig}
                        hasDigitalProducts={hasDigitalProducts}
                    />

                    <OrderSummary transaction={transaction} />

                    <ActionButtons
                        transaction={transaction}
                        onShowInvoice={() => setShowInvoice(true)}
                    />

                    {transaction.status === 'completed' && transaction.payment_status === 'paid' && (
                        <RatingRequest />
                    )}

                    <ContactInfo />
                </div>
            </div>
        </GuestLayout>
    );
};

// Helper Components
const TransactionNotFound = () => (
    <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Transaksi Tidak Ditemukan
                </h1>
                <p className="text-gray-600 mb-6">
                    Maaf, transaksi yang Anda cari tidak dapat ditemukan.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    </div>
);

interface StatusCardProps {
    transaction: Transaction;
    statusConfig: ReturnType<typeof getStatusConfig>;
    hasDigitalProducts: boolean;
}

const StatusCard = ({ transaction, statusConfig, hasDigitalProducts }: StatusCardProps) => {
    const StatusIcon = statusConfig.icon;

    return (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
            <div className={`w-16 h-16 ${statusConfig.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <StatusIcon className={`w-8 h-8 ${statusConfig.iconColor}`} />
            </div>

            <h1 className={`text-2xl font-bold ${statusConfig.titleColor} mb-2`}>
                {statusConfig.title}
            </h1>

            <p className="text-gray-600 mb-6">
                {statusConfig.description}
            </p>

            {statusConfig.showDownload && hasDigitalProducts && (
                <DigitalProductDownloadInfo />
            )}

            {statusConfig.showPaymentInfo && transaction.is_manual_payment && (
                <PaymentInfo transaction={transaction} />
            )}

            <OrderDetails transaction={transaction} />
        </div>
    );
};

const DigitalProductDownloadInfo = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
            <Download className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-900">Produk Digital Siap di Download</span>
        </div>
        <p className="text-green-700 text-sm">
            Silahkan download atau unduh produk digital kamu di Akun Saya.
        </p>
    </div>
);

interface PaymentInfoProps {
    transaction: Transaction;
}

const PaymentInfo = ({ transaction }: PaymentInfoProps) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">Informasi Pembayaran</span>
        </div>
        <p className="text-blue-700 text-sm mb-2">
            Silakan lakukan pembayaran sesuai metode yang dipilih dan upload bukti pembayaran.
        </p>
        {transaction.payment_method && (
            <p className="text-blue-800 text-sm font-medium">
                Metode: {transaction.payment_method.name}
            </p>
        )}
    </div>
);

interface OrderDetailsProps {
    transaction: Transaction;
}

const OrderDetails = ({ transaction }: OrderDetailsProps) => (
    <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Detail Pesanan</h3>
        <div className="space-y-2 text-sm">
            <DetailRow label="Nomor Pesanan:" value={`#${transaction.order_number}`} />
            <DetailRow label="Total Pembayaran:" value={`Rp${formatCurrency(transaction.total_amount)}`} />
            <DetailRow
                label="Status Pembayaran:"
                value={
                    <StatusBadge
                        color={transaction.payment_status_badge?.color}
                        text={transaction.payment_status_badge?.text}
                    />
                }
            />
            <DetailRow
                label="Status Pesanan:"
                value={
                    <StatusBadge
                        color={transaction.status_badge?.color}
                        text={transaction.status_badge?.text}
                    />
                }
            />
            {transaction.confirmed_at && (
                <DetailRow
                    label="Tanggal Konfirmasi:"
                    value={formatDateTime(transaction.confirmed_at)}
                />
            )}
            {transaction.payment_date && (
                <DetailRow
                    label="Tanggal Pembayaran:"
                    value={formatDateTime(transaction.payment_date)}
                />
            )}
            {transaction.cancelled_at && (
                <DetailRow
                    label="Tanggal Dibatalkan:"
                    value={formatDateTime(transaction.cancelled_at)}
                />
            )}
        </div>
    </div>
);

interface DetailRowProps {
    label: string;
    value: React.ReactNode;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
    <div className="flex justify-between">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
);

interface StatusBadgeProps {
    color?: string;
    text?: string;
}

const StatusBadge = ({ color, text = 'Unknown' }: StatusBadgeProps) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(color)}`}>
        {text}
    </span>
);

interface OrderSummaryProps {
    transaction: Transaction;
}

const OrderSummary = ({ transaction }: OrderSummaryProps) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
            <Receipt className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Ringkasan Pesanan</h3>
        </div>

        <div className="space-y-3 mb-4 pb-4 border-b">
            {transaction.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                    <div>
                        <span className="font-medium">{item.product?.name || 'Produk tidak tersedia'}</span>
                        <span className="text-gray-500"> x {item.quantity}</span>
                    </div>
                    <span>Rp{formatCurrency(item.total)}</span>
                </div>
            ))}
        </div>

        <div className="space-y-2 text-sm">
            <SummaryRow label="Subtotal" value={transaction.subtotal} />
            {transaction.payment_fee > 0 && (
                <SummaryRow label="Biaya Admin" value={transaction.payment_fee} />
            )}
            {transaction.wallet_amount > 0 && (
                <SummaryRow
                    label="Dari Dompet"
                    value={-transaction.wallet_amount}
                    className="text-red-600"
                />
            )}
        </div>

        <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>Rp{formatCurrency(transaction.total_amount)}</span>
            </div>
        </div>
    </div>
);

interface SummaryRowProps {
    label: string;
    value: number;
    className?: string;
}

const SummaryRow = ({ label, value, className = '' }: SummaryRowProps) => (
    <div className={`flex justify-between ${className}`}>
        <span>{label}</span>
        <span>Rp{formatCurrency(value)}</span>
    </div>
);

interface ActionButtonsProps {
    transaction: Transaction;
    onShowInvoice: () => void;
}

const ActionButtons = ({ transaction, onShowInvoice }: ActionButtonsProps) => (
    <div className="space-y-3">
        <button
            onClick={onShowInvoice}
            className="flex items-center justify-center w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
            <Download className="w-5 h-5 mr-2" />
            Download Invoice
        </button>

        {transaction.can_be_cancelled && (
            <button className="flex items-center justify-center w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">
                <XCircle className="w-5 h-5 mr-2" />
                Batalkan Pesanan
            </button>
        )}

        {transaction.is_manual_payment && transaction.payment_status === 'pending' && (
            <button className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="w-5 h-5 mr-2" />
                Upload Bukti Pembayaran
            </button>
        )}

        <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Beranda
        </button>
    </div>
);

const RatingRequest = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="text-center">
            <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400" />
                ))}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Bagaimana pengalaman berbelanja Anda?</h4>
            <p className="text-gray-600 text-sm mb-4">
                Berikan rating dan ulasan untuk membantu pelanggan lain
            </p>
            <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
                Berikan Rating
            </button>
        </div>
    </div>
);

const ContactInfo = () => (
    <div className="mt-8 text-center text-sm text-gray-500">
        <p>Butuh bantuan? Hubungi customer service kami</p>
        <p className="font-medium">WhatsApp: +62 878-0175-1656</p>
        <p className="font-medium">Email: infosandemo@gmail.com</p>
    </div>
);

// Helper functions
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getBadgeClass = (color?: string) => {
    const colors = {
        'green': 'bg-green-100 text-green-800',
        'yellow': 'bg-yellow-100 text-yellow-800',
        'blue': 'bg-blue-100 text-blue-800',
        'red': 'bg-red-100 text-red-800',
        'gray': 'bg-gray-100 text-gray-800'
    };
    return colors[color as keyof typeof colors] || colors['gray'];
};

const checkDigitalProducts = (items: OrderItem[]) => {
    return items.some(item =>
        item.product?.type === 'digital' ||
        item.product?.name?.toLowerCase().includes('template') ||
        item.product?.name?.toLowerCase().includes('digital')
    );
};

const getStatusConfig = (transaction: Transaction) => {
    const { status, payment_status, order_number } = transaction;

    if (status === 'completed' && payment_status === 'paid') {
        return {
            icon: CheckCircle,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            title: 'Pembayaran Berhasil!',
            description: `Terima kasih! Pembayaran untuk pesanan #${order_number} telah berhasil dikonfirmasi dan sedang diproses.`,
            showDownload: true,
            titleColor: 'text-gray-900'
        };
    } else if (status === 'pending' && payment_status === 'pending') {
        return {
            icon: Clock,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            title: 'Menunggu Pembayaran',
            description: `Pesanan #${order_number} menunggu pembayaran. Silakan lakukan pembayaran sesuai metode yang dipilih.`,
            showDownload: false,
            showPaymentInfo: true,
            titleColor: 'text-gray-900'
        };
    } else if (status === 'processing' && payment_status === 'paid') {
        return {
            icon: Truck,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            title: 'Pesanan Sedang Diproses',
            description: `Pembayaran untuk pesanan #${order_number} telah diterima dan sedang diproses.`,
            showDownload: false,
            titleColor: 'text-gray-900'
        };
    } else if (status === 'cancelled' || payment_status === 'cancelled') {
        return {
            icon: XCircle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            title: 'Pesanan Dibatalkan',
            description: `Pesanan #${order_number} telah dibatalkan.`,
            showDownload: false,
            titleColor: 'text-gray-900'
        };
    } else if (payment_status === 'failed') {
        return {
            icon: AlertTriangle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            title: 'Pembayaran Gagal',
            description: `Pembayaran untuk pesanan #${order_number} gagal diproses. Silakan coba lagi.`,
            showDownload: false,
            titleColor: 'text-gray-900'
        };
    } else {
        return {
            icon: Clock,
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
            title: 'Status Tidak Diketahui',
            description: `Status pesanan #${order_number} sedang diverifikasi.`,
            showDownload: false,
            titleColor: 'text-gray-900'
        };
    }
};

export default StatusPayment;