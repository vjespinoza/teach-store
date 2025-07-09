"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  CustomerDetails as CustomerDetailsType,
  useCart,
} from "@/context/CartContext";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/OrderSummary";
import EmptySummary from "@/components/EmptySummary";

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
          {cart.length > 0 ? (
            <OrderSummary
              buttonLink="/checkout"
              buttonText="Back to Shipping"
              isWithShippingDetails={true}
            />
          ) : (
            <EmptySummary
              emptyStateMessage={
                "Your cart is empty. Please add items to proceed."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
