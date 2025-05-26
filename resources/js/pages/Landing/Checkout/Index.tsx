import GuestLayout from "@/layouts/guest-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

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
  description: string;
}

interface CheckoutProps {
  cartItems: CartItem[];
  subtotal: number;
  walletBalance: number;
  maxWalletUsage: number;
  provinces: string[];
  paymentMethods: PaymentMethod[];
}

export default function CheckoutIndex({
  cartItems,
  subtotal,
  walletBalance,
  maxWalletUsage,
  provinces,
  paymentMethods
}: CheckoutProps) {
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    payment_method: '',
    wallet_amount: 0,
  });

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    const cappedAmount = Math.min(amount, maxWalletUsage);
    setWalletAmount(cappedAmount);
    setData('wallet_amount', cappedAmount);
  };

  const total = subtotal - walletAmount;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    post(route('checkout.process'), {
      preserveScroll: true,
    });
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
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Your order</h2>

                  <div className="border-b border-gray-200 pb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between py-2">
                        <div>
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-gray-500"> x {item.jumlah}</span>
                        </div>
                        <div>Rp{new Intl.NumberFormat('id-ID').format(item.product.harga * item.jumlah)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 py-4 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rp{new Intl.NumberFormat('id-ID').format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Surcharge</span>
                      <span>Rp0</span>
                    </div>
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
                        Use wallet balance (Available: Rp{new Intl.NumberFormat('id-ID').format(walletBalance)})
                      </label>
                    </div>

                    {useWallet && (
                      <div className="pl-6">
                        <label htmlFor="wallet_amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Amount to use (max: Rp{new Intl.NumberFormat('id-ID').format(maxWalletUsage)})
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

                    <div className="flex justify-between mt-2">
                      <span>Via wallet</span>
                      <span className="text-red-500">-Rp{new Intl.NumberFormat('id-ID').format(walletAmount)}</span>
                    </div>
                  </div>

                  <div className="py-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>Rp{new Intl.NumberFormat('id-ID').format(total)}</span>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Rp{new Intl.NumberFormat('id-ID').format(walletAmount)} will be debited from your wallet and
                      Rp{new Intl.NumberFormat('id-ID').format(total)} will be paid through other payment method
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Methods */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-start">
                        <input
                          id={`payment_${method.id}`}
                          name="payment_method"
                          type="radio"
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 mt-1"
                          checked={selectedPayment === method.id}
                          onChange={() => {
                            setSelectedPayment(method.id);
                            setData('payment_method', method.id.toString());
                          }}
                          required
                        />
                        <label htmlFor={`payment_${method.id}`} className="ml-3 block">
                          <span className="font-medium">{method.name}</span>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </label>
                      </div>
                    ))}
                  </div>

                  {errors.payment_method && (
                    <p className="mt-2 text-sm text-red-600">{errors.payment_method}</p>
                  )}
                </div>

                <p className="text-sm text-gray-600">Data pribadi Anda akan digunakan untuk memproses pesanan Anda dan untuk tujuan lain yang dijelaskan di <a href="#" className="underline text-blue-500">privacy policy</a> kami.</p>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms_conditions"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms_conditions" className="ml-2 text-sm text-gray-700">
                    Saya telah membaca dan menyetujui <span className="underline">terms and conditions</span> situs web ini.
                  </label>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="w-full bg-orange-600 border border-transparent rounded-md py-3 px-4 text-white font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  disabled={processing || !selectedPayment}
                >
                  Place Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
}
