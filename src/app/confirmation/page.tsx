"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/OrderSummary";
import EmptySummary from "@/components/EmptySummary";

const ConfirmationPage: React.FC = () => {
  const { lastOrderSummary } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!lastOrderSummary) {
      router.push("/");
    }
  }, [lastOrderSummary, router]);

  if (!lastOrderSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">
          Loading confirmation details or redirecting...
        </p>
      </div>
    );
  }

  const { items, shippingAddress, billingAddress } = lastOrderSummary;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartItemCount={0} />

      <div className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Order Confirmed!
        </h1>
        <p className="text-center text-lg text-green-600 mb-8">
          Thank you for your purchase!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {items.length > 0 ? (
            <OrderSummary
              buttonLink=""
              buttonText=""
              isWithShippingDetails={false}
            />
          ) : (
            <EmptySummary
              emptyStateMessage={"No items found for this order."}
            />
          )}

          <div className="bg-white p-8 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Delivery Details
            </h2>

            <div className="mb-8">
              <h3 className="font-semibold text-xl text-gray-700 mb-3">
                Shipping Address
              </h3>
              <address className="not-italic text-gray-700 leading-relaxed">
                <p>{shippingAddress.fullName}</p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && (
                  <p>{shippingAddress.addressLine2}</p>
                )}
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.zipCode}
                </p>
                <p>{shippingAddress.country}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Email: {shippingAddress.email}
                </p>
              </address>
            </div>

            {billingAddress &&
              (billingAddress.fullName !== shippingAddress.fullName ||
                billingAddress.addressLine1 !== shippingAddress.addressLine1 ||
                billingAddress.email !== shippingAddress.email) && (
                <div>
                  <h3 className="font-semibold text-xl text-gray-700 mb-3">
                    Billing Address
                  </h3>
                  <address className="not-italic text-gray-700 leading-relaxed">
                    <p>{billingAddress.fullName}</p>
                    <p>{billingAddress.addressLine1}</p>
                    {billingAddress.addressLine2 && (
                      <p>{billingAddress.addressLine2}</p>
                    )}
                    <p>
                      {billingAddress.city}, {billingAddress.state}{" "}
                      {billingAddress.zipCode}
                    </p>
                    <p>{billingAddress.country}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Email: {billingAddress.email}
                    </p>
                  </address>
                </div>
              )}
          </div>
        </div>
        <Link href="/" passHref>
          <button className="w-full bg-blue-600 text-white py-3 mt-8 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
