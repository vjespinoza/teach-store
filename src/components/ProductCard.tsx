// src/components/ProductCard.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react"; // Import the shopping cart icon

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  isInStock: boolean;
  brand: string;
  category: string;
  rating: number;
  reviews: number;
  isSale: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setQuantity(value);
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddClick = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity to 1 after adding to cart
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 sm:h-56 flex-shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          className="p-4"
        />
        {/* Sale Tag */}
        {product.isSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            SALE
          </span>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto mb-4">
          <div className="flex items-baseline space-x-2">
            {" "}
            {/* Container for prices */}
            {product.isSale && product.originalPrice > 0 && (
              <span className="text-gray-500 line-through text-base">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <span
            className={`text-sm font-medium ${product.isInStock ? "text-green-600" : "text-red-600"}`}
          >
            {product.isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Combined Quantity Selector and Add to Cart Icon Button */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-28 flex-shrink-0">
            <button
              onClick={handleDecrement}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full text-center border-x border-gray-300 py-1 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label={`Quantity for ${product.name}`}
            />
            <button
              onClick={handleIncrement}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base"
              aria-label={`Increase quantity of ${product.name}`}
            >
              +
            </button>
          </div>

          {/* Add to Cart Icon Button */}
          <button
            onClick={handleAddClick}
            disabled={!product.isInStock}
            className={`flex-grow flex items-center justify-center p-2 rounded-md transition-colors
                            ${
                              product.isInStock
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
