import GuestLayout from "@/layouts/guest-layout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Copy, Check, Clock, CreditCard, CheckIcon, CopyIcon, CreditCardIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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

interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  type: string;
  method: string;
  fee: number;
  instructions?: string;
  account_number?: string;
  account_name?: string;
}

interface PaymentDetailProps {
  transaction: Transaction;
  paymentMethod: PaymentMethod;
}

export default function PaymentDetail({ transaction, paymentMethod }: PaymentDetailProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentInstructions = () => {
    return paymentMethod.instructions
      ? paymentMethod.instructions.split('\n')
      : ['Ikuti instruksi pembayaran'];
  };

  const handleCancel = () => {
    router.post(`/payment/cancel/${transaction.order_number}`);
  };

  return (
    <GuestLayout title="Detail Pembayaran">
      <Head title="Detail Pembayaran" />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Pembayaran</h1>
                <p className="text-gray-600">Pesanan #{transaction.order_number}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.payment_status)}`}>
                  <Clock className="w-4 h-4 mr-1" />
                  {transaction.payment_status === 'pending' ? 'Menunggu Pembayaran' : transaction.payment_status}
                </span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>Dibuat pada {formatDateTime(transaction.created_at)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Instructions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-lg font-semibold">Metode Pembayaran</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-blue-900 mb-2">{paymentMethod.name}</h3>
                  <p className="text-blue-700 text-sm">{paymentMethod.instructions}</p>
                </div>

                {/* Account Details */}
                {paymentMethod.account_number && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600">Nomor Rekening</span>
                        <p className="font-mono font-semibold text-lg">{paymentMethod.account_number}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(paymentMethod.account_number!, 'account')}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        {copiedField === 'account' ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    {paymentMethod.account_name && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-600">Nama Penerima</span>
                          <p className="font-semibold">{paymentMethod.account_name}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(paymentMethod.account_name!, 'name')}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          {copiedField === 'name' ? (
                            <>
                              <CheckIcon className="w-4 h-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <CopyIcon className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <span className="text-sm text-yellow-700">Total Pembayaran</span>
                        <p className="font-bold text-xl text-yellow-900">Rp{formatCurrency(transaction.total_amount)}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(transaction.total_amount.toString(), 'amount')}
                        className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                      >
                        {copiedField === 'amount' ? (
                          <>
                            <CheckIcon className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <CopyIcon className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Petunjuk Pembayaran:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    {getPaymentInstructions().map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Upload Payment Proof */}
              {paymentMethod.method === 'manual' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Upload Bukti Pembayaran</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="payment_proof"
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="payment_proof"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <CreditCardIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 mb-1">
                        Klik untuk upload bukti pembayaran
                      </span>
                      <span className="text-xs text-gray-500">PNG, JPG hingga 2MB</span>
                    </label>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Bukti Pembayaran
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>

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

                <div className="mt-6 space-y-3">
                  <Link
                    href="/"
                    className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Kembali ke Beranda
                  </Link>
                  {transaction.status === 'pending' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="block w-full text-center bg-red-100 text-red-700 py-2 px-4 rounded-md hover:bg-red-200 transition-colors">
                          Batalkan Pesanan
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Yakin ingin membatalkan pesanan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Pesanan akan dianggap batal dan tidak bisa diproses ulang.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction className="bg-amber-500 hover:bg-amber-500 text-white" onClick={handleCancel}>
                            Ya, Batalkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
