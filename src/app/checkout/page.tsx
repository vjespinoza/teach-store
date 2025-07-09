"use client";

import React, { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  CustomerDetails as CustomerDetailsType,
  useCart,
} from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

const CheckoutPage: React.FC = () => {
  const { cart, getCartTotal, setCustomerDetails } = useCart();
  const router = useRouter();
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);
  const TAX_RATE = 0.12;
  const subtotal = getCartTotal();
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  const [customerDetails, setLocalCustomerDetails] =
    useState<CustomerDetailsType>({
      fullName: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length > 0) {
      setCustomerDetails(customerDetails);
      router.push("/payment");
    } else {
      setShowEmptyCartModal(true);
    }
  };

  const handleGoHome = () => {
    setShowEmptyCartModal(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />{" "}
      <div className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Shipping Information
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={customerDetails.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="addressLine1"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={customerDetails.addressLine1}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="addressLine2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={customerDetails.addressLine2}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customerDetails.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={customerDetails.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={customerDetails.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={customerDetails.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Proceed to Payment
              </button>
            </form>
          </div>

          <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md h-fit sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">
                Your cart is empty. Please add items to proceed.
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-700">Shipping:</span>
                    <span className="font-semibold text-green-600">
                      FREE
                    </span>{" "}
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-700">
                      Taxes ({(TAX_RATE * 100).toFixed(0)}%):
                    </span>
                    <span className="font-semibold">${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Order Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/" passHref>
                  <button className="w-full bg-gray-200 text-gray-800 py-3 mt-4 rounded-md text-lg font-semibold hover:bg-gray-300 transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showEmptyCartModal}
        onClose={() => setShowEmptyCartModal(false)} // This might not be strictly needed as the button navigates
        message="Your cart is empty! Please add items to your cart before proceeding to payment."
        buttonText="Return to Home"
        onButtonClick={handleGoHome}
      />
    </div>
  );
};

export default CheckoutPage;
