import GuestLayout from "@/layouts/guest-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";

interface CartItem {
  id: number;
  jumlah: number;
  product: {
    name: string;
    harga: number;
  };
}

interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  type: string;
  method: string;
  fee: number;
  instructions?: string;
}

interface CheckoutProps {
  cartItems: CartItem[];
  subtotal: number;
  walletBalance: number;
  maxWalletUsage: number;
  paymentMethods: Record<string, PaymentMethod[]>;
}

export default function CheckoutIndex({
  cartItems,
  subtotal,
  walletBalance,
  maxWalletUsage,
  paymentMethods
}: CheckoutProps) {
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    payment_method_id: '',
    wallet_amount: 0,
  });

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    const cappedAmount = Math.min(amount, maxWalletUsage);
    setWalletAmount(cappedAmount);
    setData('wallet_amount', cappedAmount);
  };

  // Memoized calculations to ensure proper number handling
  const calculations = useMemo(() => {
    // Find selected payment method
    const selectedMethod = selectedPayment
      ? Object.values(paymentMethods)
        .flat()
        .find(method => method.id === selectedPayment)
      : null;

    // Convert all values to numbers to prevent string concatenation
    const numSubtotal = Number(subtotal) || 0;
    const numWalletAmount = Number(walletAmount) || 0;
    const numPaymentFee = selectedMethod ? Number(selectedMethod.fee) || 0 : 0;

    // Calculate total: subtotal + payment fee - wallet amount
    const total = numSubtotal + numPaymentFee - numWalletAmount;
    const remainingToPay = Math.max(0, total - numWalletAmount);

    return {
      selectedMethod,
      subtotal: numSubtotal,
      walletAmount: numWalletAmount,
      paymentFee: numPaymentFee,
      total: Math.max(0, total), // Ensure total is never negative
      remainingToPay
    };
  }, [subtotal, walletAmount, selectedPayment, paymentMethods]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    post(route('checkout.process'), {
      preserveScroll: true,
    });
  };

  // Group labels for payment methods
  const paymentGroups = [
    {
      type: 'bank_transfer',
      title: 'Transfer Bank (Manual)',
      description: 'Transfer manual ke rekening bank kami'
    },
    {
      type: 'virtual_account',
      title: 'Virtual Account (Otomatis)',
      description: 'Pembayaran otomatis melalui Virtual Account'
    },
    {
      type: 'e_wallet',
      title: 'E-Wallet (Otomatis)',
      description: 'Pembayaran melalui dompet digital'
    },
    {
      type: 'qris',
      title: 'QRIS (Otomatis)',
      description: 'Bayar dengan scan QR Code'
    },
    {
      type: 'retail_outlet',
      title: 'Retail Outlet (Otomatis)',
      description: 'Bayar di gerai retail terdekat'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <GuestLayout title="Checkout">
      <Head title="Checkout" />
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Order Summary */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-22">
                  <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

                  <div className="border-b border-gray-200 pb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between py-2">
                        <div>
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-gray-500"> x {item.jumlah}</span>
                        </div>
                        <div>{formatCurrency(item.product.harga * item.jumlah)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 py-4 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(calculations.subtotal)}</span>
                    </div>
                    {calculations.selectedMethod && calculations.paymentFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Biaya {calculations.selectedMethod.name}</span>
                        <span className="text-blue-600">+Rp{formatCurrency(calculations.paymentFee)}</span>
                      </div>
                    )}
                    {calculations.walletAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Dari dompet</span>
                        <span className="text-red-500">-Rp{formatCurrency(calculations.walletAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="py-4 border-b border-gray-200">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="use_wallet"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        checked={useWallet}
                        onChange={(e) => {
                          setUseWallet(e.target.checked);
                          if (!e.target.checked) {
                            setWalletAmount(0);
                            setData('wallet_amount', 0);
                          }
                        }}
                      />
                      <label htmlFor="use_wallet" className="ml-2 block text-sm text-gray-700">
                        Gunakan saldo dompet (Tersedia: Rp{formatCurrency(walletBalance)})
                      </label>
                    </div>

                    {useWallet && (
                      <div className="pl-6">
                        <label htmlFor="wallet_amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Jumlah yang digunakan (maksimal: Rp{formatCurrency(maxWalletUsage)})
                        </label>
                        <input
                          type="number"
                          id="wallet_amount"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          min="0"
                          max={maxWalletUsage}
                          step="1"
                          value={walletAmount}
                          onChange={handleWalletChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="py-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>Rp{formatCurrency(calculations.total)}</span>
                    </div>

                    {calculations.walletAmount > 0 && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                          <strong>Rp{formatCurrency(calculations.walletAmount)}</strong> akan di-debet dari saldo dompet Anda
                          {calculations.total > calculations.walletAmount && (
                            <>
                              {' '}dan <strong>Rp{formatCurrency(calculations.total - calculations.walletAmount)}</strong> akan dibayar melalui metode pembayaran yang dipilih
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Methods */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Metode Pembayaran</h2>

                  <div className="space-y-6">
                    {paymentGroups.map((group) => (
                      paymentMethods[group.type] && paymentMethods[group.type].length > 0 && (
                        <div key={group.type} className="space-y-3">
                          <div>
                            <h3 className="font-medium">{group.title}</h3>
                            <p className="text-sm text-gray-500">{group.description}</p>
                          </div>
                          <div className="space-y-2 pl-4">
                            {paymentMethods[group.type].map((method) => (
                              <div key={method.id} className="flex items-start">
                                <input
                                  id={`payment_${method.id}`}
                                  name="payment_method_id"
                                  type="radio"
                                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 mt-1"
                                  checked={selectedPayment === method.id}
                                  onChange={() => {
                                    setSelectedPayment(method.id);
                                    setData('payment_method_id', method.id.toString());
                                  }}
                                  required
                                />
                                <label htmlFor={`payment_${method.id}`} className="ml-3 block">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{method.name}</span>
                                    {method.fee > 0 && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                        +Rp{formatCurrency(method.fee)}
                                      </span>
                                    )}
                                  </div>
                                  {method.instructions && (
                                    <p className="text-sm text-gray-500 mt-1">{method.instructions}</p>
                                  )}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {errors.payment_method_id && (
                    <p className="mt-2 text-sm text-red-600">{errors.payment_method_id}</p>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  Data pribadi Anda akan digunakan untuk memproses pesanan Anda dan untuk tujuan lain yang dijelaskan di
                  <a href="#" className="underline text-blue-500 ml-1">kebijakan privasi</a> kami.
                </p>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms_conditions"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms_conditions" className="ml-2 text-sm text-gray-700">
                    Saya telah membaca dan menyetujui <span className="underline">syarat dan kondisi</span> situs web ini.
                  </label>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="w-full bg-orange-600 border border-transparent rounded-md py-3 px-4 text-white font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  disabled={processing || !selectedPayment}
                >
                  Buat Pesanan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
}
