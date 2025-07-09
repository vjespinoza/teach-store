"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal } =
    useCart();
  const TAX_RATE = 0.12;

  if (!isOpen) return null;

  const subtotal = getCartTotal();
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      onClick={onClose}
    >
      <div
        id="cart-modal"
        className="bg-white w-full max-w-md h-full shadow-lg flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            id="cart-modal-close-button"
            onClick={onClose}
            className="p-2 rounded-full bg-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <div
          id="cart-modal-product-list"
          className="flex-1 overflow-y-auto p-4"
        >
          {cart.length === 0 ? (
            <p
              id="cart-modal-empty-state"
              className="text-center text-gray-500 mt-8"
            >
              Your cart is empty.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                data-testid="cart-modal-product"
                className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                    data-testid="cart-modal-product-image"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-medium text-gray-800 line-clamp-2"
                    data-testid="cart-modal-product-name"
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span data-testid="cart-modal-product-price">
                      ${item.price.toFixed(2)}
                    </span>{" "}
                    x{" "}
                    <span data-testid="cart-modal-product-quantity">
                      {item.quantity}
                    </span>
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    Item Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1.5 text-gray-500 rounded-l-md"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span
                      data-testid="cart-modal-product-quantity-edit"
                      className="px-3 text-sm font-medium text-gray-500"
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1.5 text-gray-500 rounded-r-md"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-xs hover:underline mt-1"
                    data-testid="cart-modal-product-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="p-4 border-t border-gray-200"
          id="cart-modal-summary-section"
        >
          <div className="flex justify-between py-1">
            <span className="text-gray-700">Subtotal:</span>
            <span
              className="font-semibold text-gray-700"
              id="cart-modal-summary-subtotal"
            >
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-700">
              Taxes ({(TAX_RATE * 100).toFixed(0)}%):
            </span>
            <span
              className="font-semibold text-gray-700"
              id="cart-modal-summary-tax"
            >
              ${taxes.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-1 text-lg font-bold">
            <span className="text-gray-700">Total:</span>
            <span className="text-gray-700" id="cart-modal-summary-total">
              ${total.toFixed(2)}
            </span>
          </div>
          <Link href="/checkout" passHref>
            <button
              className="w-full bg-blue-600 text-white py-3 mt-4 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={onClose}
              disabled={cart.length === 0}
              id="cart-modal-confirm"
            >
              Confirm
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
