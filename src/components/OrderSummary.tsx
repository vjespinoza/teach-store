"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import ShippingDetails from "@/components/ShippingDetails";

interface OrderSummaryProps {
  buttonLink: string;
  buttonText: string;
  isWithShippingDetails: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  buttonLink,
  buttonText,
  isWithShippingDetails,
}) => {
  const { cart, getCartTotal } = useCart();

  const TAX_RATE = 0.12;
  const subtotal = getCartTotal();
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  return (
    <div
      id="order-summary"
      className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md h-fit sticky top-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Order Summary
      </h2>
      <div id="order-summary-product-list" className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            data-testid="order-summary-product"
            className="flex items-center gap-4"
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                layout="fill"
                objectFit="contain"
                className="rounded-md"
                data-testid="order-summary-product-image"
              />
            </div>
            <div className="flex-1">
              <h3
                className="font-medium text-gray-800 line-clamp-1"
                data-testid="order-summary-product-name"
              >
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">
                $
                <span data-testid="order-summary-product-price">
                  {item.price.toFixed(2)}
                </span>{" "}
                x
                <span data-testid="order-summary-product-quantity">
                  {item.quantity}
                </span>
              </p>
            </div>
            <span
              className="font-semibold text-gray-800"
              data-testid="order-summary-product-total-price"
            >
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between py-1">
          <span className="text-gray-700">Subtotal:</span>
          <span className="font-semibold" id="order-summary-subtotal">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-gray-700">Shipping:</span>
          <span
            className="font-semibold text-green-600"
            id="order-summary-shipping-fee"
          >
            FREE
          </span>{" "}
        </div>
        <div className="flex justify-between py-1">
          <span className="text-gray-700">
            Taxes ({(TAX_RATE * 100).toFixed(0)}%):
          </span>
          <span id="order-summary-tax" className="font-semibold">
            ${taxes.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between py-2 text-lg font-bold">
          <span>Order Total:</span>
          <span id="order-summary-order-total">${total.toFixed(2)}</span>
        </div>
      </div>

      <ShippingDetails showShippingDetails={isWithShippingDetails} />

      {buttonText === "" ? (
        <></>
      ) : (
        <Link href={buttonLink} passHref>
          <button
            id="order-summary-return-button"
            className="w-full bg-gray-200 text-gray-800 py-3 mt-4 rounded-md text-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            {buttonText}
          </button>
        </Link>
      )}
    </div>
  );
};

export default OrderSummary;
