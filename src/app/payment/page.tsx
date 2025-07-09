"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  CustomerDetails as CustomerDetailsType,
  useCart,
} from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface CreditCardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage: React.FC = () => {
  const {
    cart,
    getCartTotal,
    customerDetails,
    setLastOrderSummary,
    clearCart,
  } = useCart();
  const router = useRouter();
  const TAX_RATE = 0.12;

  const subtotal = getCartTotal();
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  const [cardDetails, setCardDetails] = useState<CreditCardDetails>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] =
    useState(true);
  const [billingAddress, setBillingAddress] = useState<CustomerDetailsType>({
    fullName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (!customerDetails || cart.length === 0) {
      router.push("/checkout");
    }
  }, [customerDetails, cart.length, router]);

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleBillingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBillingAddress((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!customerDetails) {
      console.error("Shipping address missing. Redirecting to checkout.");
      router.push("/checkout");
      return;
    }

    console.log("Processing payment...");
    console.log("Credit Card Details:", cardDetails);
    console.log("Shipping Address:", customerDetails);
    console.log(
      "Billing Address:",
      billingAddressSameAsShipping ? "Same as shipping" : billingAddress,
    );

    const orderSummary = {
      items: cart,
      subtotal,
      taxes,
      total,
      shippingAddress: customerDetails,
      billingAddress: billingAddressSameAsShipping
        ? customerDetails
        : billingAddress,
    };

    setLastOrderSummary(orderSummary);
    clearCart();

    setTimeout(() => {
      console.log("Payment successful!");
      router.push("/confirmation");
    }, 1500);
  };

  if (!customerDetails || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Redirecting to checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartItemCount={0} />

      <div className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Payment Information
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Payment Details
            </h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="XXXX XXXX XXXX XXXX"
                  required
                  pattern="[0-9]{13,16}"
                  title="Card number should be 13 to 16 digits"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={cardDetails.cardName}
                  onChange={handleCardInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                    required
                    pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
                    title="Expiry date must be in MM/YY format"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="XXX"
                    required
                    pattern="[0-9]{3,4}"
                    title="CVV must be 3 or 4 digits"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600 rounded"
                    checked={billingAddressSameAsShipping}
                    onChange={(e) =>
                      setBillingAddressSameAsShipping(e.target.checked)
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Billing address is same as shipping address
                  </span>
                </label>
              </div>

              {!billingAddressSameAsShipping && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Billing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="billingFullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="billingFullName"
                        name="fullName"
                        value={billingAddress.fullName}
                        onChange={handleBillingAddressChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="billingEmail"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="billingEmail"
                        name="email"
                        value={billingAddress.email}
                        onChange={handleBillingAddressChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="billingAddressLine1"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="billingAddressLine1"
                      name="addressLine1"
                      value={billingAddress.addressLine1}
                      onChange={handleBillingAddressChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="billingAddressLine2"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      id="billingAddressLine2"
                      name="addressLine2"
                      value={billingAddress.addressLine2}
                      onChange={handleBillingAddressChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label
                        htmlFor="billingCity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="billingCity"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleBillingAddressChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="billingState"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="billingState"
                        name="state"
                        value={billingAddress.state}
                        onChange={handleBillingAddressChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="billingZipCode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="billingZipCode"
                        name="zipCode"
                        value={billingAddress.zipCode}
                        onChange={handleBillingAddressChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="billingCountry"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="billingCountry"
                      name="country"
                      value={billingAddress.country}
                      onChange={handleBillingAddressChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
                disabled={cart.length === 0}
              >
                Pay Now
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
                    <span className="font-semibold text-green-600">FREE</span>
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

                <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Shipping To:
                  </h3>
                  {customerDetails && (
                    <address className="not-italic text-sm text-gray-700">
                      {customerDetails.fullName}
                      <br />
                      {customerDetails.addressLine1}
                      <br />
                      {customerDetails.addressLine2}
                      <br />
                      {customerDetails.city}, {customerDetails.state}{" "}
                      {customerDetails.zipCode}
                      <br />
                      {customerDetails.country}
                    </address>
                  )}
                </div>

                <Link href="/checkout" passHref>
                  <button className="w-full bg-gray-200 text-gray-800 py-3 mt-4 rounded-md text-lg font-semibold hover:bg-gray-300 transition-colors">
                    Back to Shipping
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
