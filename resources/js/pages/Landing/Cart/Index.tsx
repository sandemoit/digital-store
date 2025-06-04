import { useEffect, useMemo, useState } from 'react';
import GuestLayout from "@/layouts/guest-layout";
import { Trash2, ShoppingCart, CheckCircle, Lock, Gift } from 'lucide-react';
import { toast } from 'sonner';
import RupiahFormatter from '@/components/ui/rupiahFormat';
import { usePage, router, Link } from '@inertiajs/react';
import { SharedData } from '@/types';

// Type definitions
type CartItem = {
  id: number;
  name: string;
  gambar: string;
  harga: number;
  quantity: number;
  product_id?: number; // Untuk kompatibilitas dengan data dari database
};

interface Props {
  title?: string;
  cart?: CartItem[]; // Data cart dari server jika user login
}

export default function Cart({ title, cart: serverCart }: Props) {
  const { auth } = usePage<SharedData>().props;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart data from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    try {
      if (auth.user) {
        // Jika user login, gunakan data dari server
        if (serverCart) {
          // Format data dari database ke format yang diharapkan komponen
          const formattedCart = serverCart.map(item => ({
            id: item.product_id || item.id,
            name: item.name,
            gambar: item.gambar,
            harga: item.harga,
            quantity: item.quantity
          }));
          setCartItems(formattedCart);
        }
      } else {
        // Jika guest, ambil dari local storage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [auth.user, serverCart]);

  // Save cart data to localStorage (hanya untuk guest)
  useEffect(() => {
    if (!isLoading && !auth.user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading, auth.user]);

  // Remove item from cart
  const removeItem = (id: number) => {
    if (auth.user) {
      router.delete(route('cart.remove', { productId: id }), {
        onSuccess: () => {
          toast.success('Berhasil', {
            description: 'Item dihapus dari keranjang',
          });
        },
        onError: () => {
          toast.error('Gagal', {
            description: 'Gagal menghapus item dari keranjang',
          });
        }
      });
    } else {
      setCartItems(prev => prev.filter(item => item.id !== id));
      toast.success('Berhasil', {
        description: 'Item dihapus dari keranjang',
      });
    }
  };

  // Clear entire cart
  const clearCart = () => {
    if (auth.user) {
      router.delete(route('cart.clear'), {
        onSuccess: () => {
          toast.success('Berhasil', {
            description: 'Menghapus semua item di keranjang',
          });
        },
        onError: () => {
          toast.error('Gagal', {
            description: 'Gagal menghapus semua item dari keranjang',
          });
        }
      });
    } else {
      setCartItems([]);
      toast.success('Berhasil', {
        description: 'Menghapus semua item di keranjang',
      });
    }
  };

  // Calculate subtotal for a single item
  const calculateItemSubtotal = (item: CartItem) => {
    return item.harga * item.quantity;
  };

  // Calculate cart totals
  const cartSubtotal = useMemo(() =>
    cartItems.reduce((total, item) => total + calculateItemSubtotal(item), 0),
    [cartItems]
  );
  // const taxAmount = useMemo(() => cartSubtotal * 0.1, [cartSubtotal]);
  // const cartTotal = useMemo(() => cartSubtotal + taxAmount, [cartSubtotal, taxAmount]);

  return (
    <GuestLayout title={title ?? 'Keranjang Belanja'}>
      <div className="bg-gray-50 min-h-auto py-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
            <span className="flex items-center text-gray-600">
              <ShoppingCart className="mr-2" size={20} />
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white shadow rounded-sm p-15 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={64} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Keranjang Belanja Kosong</h2>
              <p className="text-gray-500 mb-6">Belum ada produk di keranjang Anda.</p>
              <a href="/products" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-sm transition-colors">
                Mulai Belanja
              </a>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white shadow rounded-sm overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 bg-white p-4 text-sm font-medium text-gray-600">
                    <div className="col-span-8">Produk</div>
                    <div className="col-span-2 text-center">Jumlah</div>
                    <div className="col-span-2 text-right">Harga</div>
                  </div>
                  <div className="hidden md:block h-px bg-gray-200"></div>

                  {/* Mobile-optimized list view */}
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-4">
                        {/* Mobile view - Display as simple list */}
                        <div className="md:hidden">
                          <div className="flex space-x-3">
                            <img
                              src={`/storage/${item.gambar}`}
                              alt={item.name}
                              className="w-16 h-16 rounded-sm object-cover border border-gray-200"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="mt-2 flex justify-between text-sm">
                                <span className="text-gray-600">Qty: {item.quantity}</span>
                              </div>
                              <div className="mt-2 text-right font-medium text-gray-900">
                                {calculateItemSubtotal(item).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop view - Grid layout */}
                        <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                          {/* Product */}
                          <div className="md:col-span-8 flex items-center space-x-4">
                            <img
                              src={`/storage/${item.gambar}`}
                              alt={item.name}
                              className="w-20 h-20 rounded-sm object-cover border border-gray-200"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex items-center text-red-500 hover:text-red-700 text-sm mt-2"
                              >
                                <Trash2 size={16} className="mr-1" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="md:col-span-2 flex items-center justify-center">
                            {item.quantity}
                          </div>

                          {/* Subtotal */}
                          <div className="md:col-span-2 text-right font-medium text-gray-900">
                            {calculateItemSubtotal(item).toLocaleString()}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="h-px bg-gray-200"></div>
                  <div className="bg-white px-4 md:px-6 py-4 flex justify-between">
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                    >
                      <Trash2 size={16} className="mr-1" />
                      <span className="hidden md:inline">Hapus Semua</span>
                      <span className="md:hidden">Hapus</span>
                    </button>
                    <a
                      href="/produk"
                      className="text-amber-500 hover:text-amber-800 text-sm font-medium"
                    >
                      Lanjut Belanja
                    </a>
                  </div>
                </div>
                <div className="bg-white shadow rounded-sm mt-4 p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Masukan kupon diskon"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Terapkan Kupon
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white shadow rounded-sm p-6 sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cartItems.length} produk)</span>
                      <span className="font-medium">{cartSubtotal.toLocaleString()}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Pajak (10%)</span>
                      <span className="font-medium">{taxAmount.toLocaleString()}</span>
                    </div> */}
                    <div className="border-t border-gray-200 my-3 pt-3 flex justify-between">
                      <span className="font-medium text-gray-900">Total</span>
                      <RupiahFormatter
                        className='font-bold text-amber-500 text-lg'
                        value={cartSubtotal}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-4">
                    <Link
                      href={auth.user ? route('checkout') : '/login'}
                      className="flex items-center w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-sm transition-colors"
                    >
                      <Lock size={16} className="mr-2" />
                      Lanjut Proses Pembelian
                    </Link>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-500 mr-1" />
                    <span>Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GuestLayout>
  );
}
