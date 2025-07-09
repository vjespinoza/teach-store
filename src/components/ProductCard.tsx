// src/components/ProductCard.tsx

import Image from 'next/image';
import {Star} from 'lucide-react'; // For star ratings

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number; // Optional for sale items
    imageUrl: string;
    category: string;
    brand: string;
    rating?: number; // Optional star rating
    reviews?: number; // Number of reviews
    isInStock: boolean;
    isSale?: boolean;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative group">
            {product.isSale && (
                <span
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          SALE
        </span>
            )}
            <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <h3 className="font-semibold text-gray-800 h-12 overflow-hidden text-ellipsis mb-2">
                    {product.name}
                </h3>
                {product.rating !== undefined && (
                    <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < product.rating! ? 'currentColor' : 'none'}
                                stroke={i < product.rating! ? 'currentColor' : 'gray'}
                                className={i < product.rating! ? 'text-yellow-500' : 'text-gray-300'}
                            />
                        ))}
                        {product.reviews !== undefined && (
                            <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
                        )}
                    </div>
                )}
                <div className="flex items-baseline mb-3">
                    {product.originalPrice && (
                        <span className="text-gray-400 line-through mr-2">${product.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-red-600 font-bold text-lg">${product.price.toFixed(2)}</span>
                </div>
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    disabled={!product.isInStock}
                >
                    {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;