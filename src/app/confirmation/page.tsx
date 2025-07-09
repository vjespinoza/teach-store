// src/app/confirmation/page.tsx

'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ConfirmationPage: React.FC = () => {
    const { lastOrderSummary } = useCart();
    const router = useRouter();
    const TAX_RATE = 0.12; // Ensure this matches the rate used elsewhere

    // Redirect if no order summary is found (e.g., direct access or refresh)
    useEffect(() => {
        if (!lastOrderSummary) {
            router.push('/'); // Redirect to home or a dedicated "order history" page if implemented
        }
    }, [lastOrderSummary, router]);

    if (!lastOrderSummary) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Loading confirmation details or redirecting...</p>
            </div>
        );
    }

    const { items, subtotal, taxes, total, shippingAddress, billingAddress } = lastOrderSummary;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar cartItemCount={0} />

            <div className="container mx-auto p-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Order Confirmed!</h1>
                <p className="text-center text-lg text-green-600 mb-8">Thank you for your purchase!</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Order Summary */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Order</h2>
                        {items.length === 0 ? (
                            <p className="text-center text-gray-500">No items found for this order.</p>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
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
                                                <h3 className="font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
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
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-700">Shipping:</span>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-700">Taxes ({(TAX_RATE * 100).toFixed(0)}%):</span>
                                        <span className="font-semibold">${taxes.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 text-lg font-bold">
                                        <span>Order Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Address Details */}
                    <div className="bg-white p-8 rounded-lg shadow-md h-fit">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Delivery Details</h2>

                        {/* Shipping Address */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-xl text-gray-700 mb-3">Shipping Address</h3>
                            <address className="not-italic text-gray-700 leading-relaxed">
                                <p>{shippingAddress.fullName}</p>
                                <p>{shippingAddress.addressLine1}</p>
                                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                                <p>{shippingAddress.country}</p>
                                <p className="mt-2 text-sm text-gray-600">Email: {shippingAddress.email}</p>
                            </address>
                        </div>

                        {/* Billing Address (Conditional) */}
                        {billingAddress && (billingAddress.fullName !== shippingAddress.fullName ||
                            billingAddress.addressLine1 !== shippingAddress.addressLine1 ||
                            billingAddress.email !== shippingAddress.email) && (
                            <div>
                                <h3 className="font-semibold text-xl text-gray-700 mb-3">Billing Address</h3>
                                <address className="not-italic text-gray-700 leading-relaxed">
                                    <p>{billingAddress.fullName}</p>
                                    <p>{billingAddress.addressLine1}</p>
                                    {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                                    <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                                    <p>{billingAddress.country}</p>
                                    <p className="mt-2 text-sm text-gray-600">Email: {billingAddress.email}</p>
                                </address>
                            </div>
                        )}

                        <Link href="/" passHref>
                            <button className="w-full bg-blue-600 text-white py-3 mt-8 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;