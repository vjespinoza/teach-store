// src/context/CartContext.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/components/ProductCard';

export interface CartItem extends Product {
    quantity: number;
}

// Define CustomerDetails type (copied from checkout page)
export interface CustomerDetails {
    fullName: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartItemQuantity: (productId: string, quantity: number) => void;
    getCartTotal: () => number;
    getCartItemCount: () => number;
    // New: Customer details for checkout flow
    customerDetails: CustomerDetails | null; // Null initially
    setCustomerDetails: (details: CustomerDetails) => void;
    // New: Order details for confirmation
    lastOrderSummary: {
        items: CartItem[];
        subtotal: number;
        taxes: number;
        total: number;
        shippingAddress: CustomerDetails;
        billingAddress?: CustomerDetails; // Optional billing address
    } | null;
    setLastOrderSummary: (summary: CartContextType['lastOrderSummary']) => void;
    clearCart: () => void; // New: To clear cart after successful payment
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
    const [lastOrderSummary, setLastOrderSummary] = useState<CartContextType['lastOrderSummary']>(null);


    const addToCart = (product: Product, quantity: number = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateCartItemQuantity = (productId: string, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateCartItemQuantity,
                getCartTotal,
                getCartItemCount,
                customerDetails, // Provide customerDetails
                setCustomerDetails, // Provide setCustomerDetails
                lastOrderSummary, // Provide lastOrderSummary
                setLastOrderSummary, // Provide setLastOrderSummary
                clearCart, // Provide clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};