import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronDown, ShoppingCart, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import FooterFront from '@/layouts/footer-depan-layout';
import React from 'react';
import { toast } from 'sonner';
import useCartCount from '@/hooks/carCount';

interface GuestLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function GuestLayout({ title = 'Sandemo.id', children }: GuestLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const { auth, flash } = usePage<SharedData>().props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success('Berhasil', { description: flash.success });
    } else if (flash?.error) {
      toast.error('Gagal', { description: flash.error });
    }
  }, [flash]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cartCount = useCartCount();

  return (
    <>
      <Head title={title}>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="w-full items-center justify-center opacity-100 transition-opacity duration-750 starting:opacity-0">
        {/* Header */}
        <header
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm py-3" : "bg-white py-4"
            }`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center rounded mr-2">
                    <div className="h-4 w-4 bg-white transform rotate-45"></div>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    Sandemo<span className="text-orange-600">.id</span>
                  </span>
                </a>
              </div>

              {/* Menu Desktop */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href={route('home')} className='text-gray-600 hover:text-orange-600 font-medium'>
                  Beranda
                </Link>
                <Link href={route('produk.index')} className='text-gray-600 hover:text-orange-600 font-medium'>
                  Produk Kami
                </Link>
                <Link href={route('kontak')} className='text-gray-600 hover:text-orange-600 font-medium'>
                  Kontak
                </Link>
                <div
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                >
                  {/* Trigger Button */}
                  <button
                    className="text-gray-600 hover:text-orange-600 font-medium flex items-center py-2 px-3 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    Item
                    <ChevronDown
                      size={16}
                      className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-sm py-2 transition-all duration-200 ease-linear z-50 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Item Utama
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Landing Page
                    </a>
                  </div>
                </div>
              </nav>

              {/* User Actions */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="/cart" className="relative">
                  <ShoppingCart size={22} className="text-gray-700 hover:text-orange-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </a>
                {auth.user ? (
                  <div className="relative group">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-orange-600 font-medium flex items-center"
                    >
                      <User size={20} className="mr-1" />
                      <ChevronDown size={16} className="ml-1" />
                    </a>
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-sm overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-linear">
                      {/* User profile header */}
                      <div className="bg-orange-100 p-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <User size={28} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{auth.user.name}</div>
                            <div className="text-sm text-gray-600">{auth.user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        {auth.user.role === 'admin' ? (
                          <Link
                            href={route('admin.dashboard')}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        ) : (
                          <Link
                            href={route('buyer.profile')}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Akun Saya
                          </Link>
                        )}

                        <Link
                          href='#'
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Riwayat Pembelian
                        </Link>

                        {/* Conditional My Products menu untuk penjual/admin */}
                        {auth.user.role === 'admin' && (
                          <Link
                            href={route('product.index')}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Produk Saya
                          </Link>
                        )}

                        <div className="border-t border-gray-200 mt-1 pt-1 px-4 py-2">
                          <Link
                            href={route('logout')}
                            onClick={() => toast.success('Berhasil logout')}
                            method="post"
                            as="button"
                            className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600"
                          >
                            Logout
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href={route('login')}
                      className="text-gray-700 hover:text-orange-600 font-medium flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Log in
                    </Link>
                    <Link
                      href={route('register')}
                      className="text-gray-700 hover:text-orange-600 font-medium flex items-center border border-gray-300 rounded-sm px-2"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
              {/* Mobile Actions */}
              <div className="flex md:hidden items-center space-x-4">
                {/* Cart Icon - Always visible on mobile */}
                <a href="/cart" className="relative">
                  <ShoppingCart size={22} className="text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </a>

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gray-900 bg-opacity-50"
                onClick={() => setMobileMenuOpen(false)}
              ></div>
              {/* Sidebar */}
              <div className="absolute right-0 top-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                {/* Close button */}
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-medium text-gray-800">Menu</h3>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Items */}
                <nav className="flex flex-col p-4">
                  <Link
                    href='#'
                    className='text-gray-600 hover:text-orange-600 font-medium py-3 border-b border-gray-100'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Beranda
                  </Link>
                  {/* Mobile Dropdown */}
                  <div className="py-3 border-b border-gray-100">
                    <div
                      onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                      className="flex justify-between items-center text-gray-600 font-medium cursor-pointer px-4"
                    >
                      <span>Item</span>
                      <ChevronDown size={16} className={`transform transition-transform ${mobileSubmenuOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {mobileSubmenuOpen && (
                      <div className="mt-2 pl-6">
                        <Link
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Item Utama
                        </Link>
                        <Link
                          href="#"
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Landing Page
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    href='#'
                    className='text-gray-600 hover:text-orange-600 font-medium py-3 border-b border-gray-100'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontak
                  </Link>
                  {auth.user ? (
                    <Link
                      href={route(auth.user?.role === 'admin' ? 'admin.dashboard' : 'buyer.profile')}
                      className='text-gray-700 hover:text-orange-600 font-medium py-3 border-b border-gray-100'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {auth.user?.role === 'admin' ? 'Dashboard' : 'Akun Saya'}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={route('login')}
                        className="text-gray-700 hover:text-orange-600 font-medium py-3 border-b border-gray-100 flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Log in
                      </Link>
                      <Link
                        href={route('register')}
                        className="text-gray-700 hover:text-orange-600 font-medium py-3 border-b border-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          )}
        </header >

        {/* Main Content */}
        < div className="pt-16" >
          {children}
        </div >

        {/* Footer */}
        < div className="w-full bg-gray-900" >
          <FooterFront />
        </div >
      </div >
    </>
  );
}
