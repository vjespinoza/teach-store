// src/components/Navbar.tsx

"use client"; // Add this directive because Navbar will now manage client-side state

import Link from "next/link";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react"; // <--- Import useState
import CartModal from "./CartModal"; // <--- Import CartModal
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  cartItemCount: number;
}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { getCartItemCount, getCartTotal } = useCart();

  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left section: Logo and Search */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-white">
            Digitic.
          </Link>
          <div className="relative flex items-center bg-gray-700 rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-64"
            />
            <button className="p-2 bg-yellow-500 hover:bg-yellow-600">
              <Search size={20} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Right section: Icons and Cart */}
        <div className="flex items-center space-x-6">
          <Link
            href="/compare-products"
            className="flex flex-col items-center text-sm hover:text-gray-300"
          >
            <span className="text-xs">Compare</span>
            <span className="text-xs">Products</span>
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-col items-center text-sm hover:text-gray-300"
          >
            <Heart size={20} />
            <span className="text-xs">Wishlist</span>
          </Link>
          <Link
            href="/my-account"
            className="flex flex-col items-center text-sm hover:text-gray-300"
          >
            <User size={20} />
            <span className="text-xs">Log In</span>
            <span className="text-xs">My Account</span>
          </Link>
          {/* Cart Button */}
          <button
            className="relative flex items-center hover:text-gray-300"
            onClick={openCartModal}
          >
            <ShoppingCart size={24} />
            {getCartItemCount() > 0 && ( // <--- Use getCartItemCount() directly
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
            <span className="ml-2">${getCartTotal().toFixed(2)}</span>{" "}
            {/* <--- Display actual cart total */}
          </button>
        </div>
      </div>

      {/* Secondary Nav / Categories */}
      <div className="container mx-auto mt-4 bg-gray-700 rounded-md p-2 flex justify-start items-center space-x-6 text-sm">
        <Link href="#" className="font-semibold text-yellow-400">
          SHOP CATEGORIES
        </Link>
        <Link href="#" className="hover:text-gray-300">
          HOME
        </Link>
        <Link href="#" className="hover:text-gray-300">
          OUR STORE
        </Link>
        <Link href="#" className="text-red-400 hover:text-red-300">
          SPECIAL{" "}
          <span className="bg-red-500 text-white text-xs px-1 rounded">
            SALE
          </span>
        </Link>
        <Link href="#" className="hover:text-gray-300">
          CATEGORIES
        </Link>
        <Link href="#" className="text-yellow-400 hover:text-yellow-300">
          TOP DEALS{" "}
          <span className="bg-yellow-500 text-gray-900 text-xs px-1 rounded">
            HOT
          </span>
        </Link>
        <Link href="#" className="hover:text-gray-300">
          ELEMENTS
        </Link>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={closeCartModal} />
    </nav>
  );
};

export default Navbar;
