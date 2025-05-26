import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export default function useCartCount() {
  const { auth } = usePage<SharedData>().props;
  const [cartCount, setCartCount] = useState(0);

  // Fungsi untuk mendapatkan count dari local storage
  const getLocalCartCount = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart).length : 0;
  };

  useEffect(() => {
    if (auth.user) {
      // Jika user login, ambil count dari server
      const fetchCartCount = async () => {
        try {
          const response = await fetch(route('cart.count'));
          const data = await response.json();
          setCartCount(data.count);
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
        }
      };

      fetchCartCount();
    } else {
      // Jika guest, ambil dari local storage
      setCartCount(getLocalCartCount());

      // Listen for cart updates in local storage
      const handleStorageChange = () => {
        setCartCount(getLocalCartCount());
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [auth.user]);

  return cartCount;
}
