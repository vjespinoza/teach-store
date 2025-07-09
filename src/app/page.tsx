// src/app/page.tsx

'use client'; // This directive indicates that this is a Client Component

import Navbar from '@/components/Navbar';
import ProductCard, {Product} from '@/components/ProductCard';
import {mockProducts} from '@/data/products';
import {useCart} from '@/context/CartContext'; // Import useCart hook
import {useState} from 'react';

// Define types for filter and sort state (can be expanded later)
type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'default';

export default function Home() {
    const {getCartItemCount, addToCart} = useCart();
    const [products, setProducts] = useState(mockProducts); // State to hold filtered/sorted products
    const [filters, setFilters] = useState({
        inStock: false,
        outOfStock: false,
        priceRange: {min: 0, max: 5000}, // A very broad range initially
        productType: [] as string[],
        brand: [] as string[],
        color: [] as string[], // Placeholder for color filter
        storage: [] as string[], // Placeholder for storage filter
    });
    const [sortOption, setSortOption] = useState<SortOption>('default');

    // Basic filtering and sorting logic (will be enhanced)
    const applyFiltersAndSort = () => {
        let filtered = mockProducts.filter(product => {
            // Stock filter
            if (filters.inStock && !product.isInStock) return false;
            if (filters.outOfStock && product.isInStock) return false;

            // Price range filter
            if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false;

            // Product Type filter
            if (filters.productType.length > 0 && !filters.productType.includes(product.category)) return false;

            // Brand filter
            if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) return false;

            return true;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            if (sortOption === 'price-asc') {
                return a.price - b.price;
            } else if (sortOption === 'price-desc') {
                return b.price - a.price;
            } else if (sortOption === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'name-desc') {
                return b.name.localeCompare(a.name);
            }
            return 0; // Default or no sort
        });

        return filtered;
    };

    // Re-run filter/sort when dependencies change (for simplicity, we'll call this on initial render for now)
    // In a real app, this would be triggered by filter/sort changes
    useState(() => {
        setProducts(applyFiltersAndSort());
    });

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        // You could add a small confirmation message here
    };

    // Extract unique categories and brands for filter options
    const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));
    const uniqueBrands = Array.from(new Set(mockProducts.map(p => p.brand)));

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar cartItemCount={getCartItemCount()}/>

            <div className="container mx-auto p-4 flex gap-6 mt-4">
                {/* Left Sidebar for Filters */}
                <aside className="w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
                    <h2 className="text-xl font-semibold mb-4">Filter</h2>

                    {/* Availability Filter */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Availability</h3>
                        <label className="flex items-center space-x-2 mb-1">
                            <input
                                type="checkbox"
                                className="form-checkbox text-blue-600 rounded"
                                checked={filters.inStock}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    inStock: e.target.checked,
                                    outOfStock: false
                                }))}
                            />
                            <span>In stock ({mockProducts.filter(p => p.isInStock).length})</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="form-checkbox text-blue-600 rounded"
                                checked={filters.outOfStock}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    outOfStock: e.target.checked,
                                    inStock: false
                                }))}
                            />
                            <span>Out of stock ({mockProducts.filter(p => !p.isInStock).length})</span>
                        </label>
                    </div>

                    {/* Price Filter (simplified for now) */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Price</h3>
                        <p className="text-sm text-gray-500 mb-2">The highest price is
                            ${Math.max(...mockProducts.map(p => p.price)).toFixed(2)}</p>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.priceRange.min}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    priceRange: {...prev.priceRange, min: Number(e.target.value)}
                                }))}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.priceRange.max}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    priceRange: {...prev.priceRange, max: Number(e.target.value)}
                                }))}
                            />
                        </div>
                        {/* Implement actual price range slider later */}
                    </div>

                    {/* Product Type Filter */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Product type</h3>
                        {uniqueCategories.map((category) => (
                            <label key={category} className="flex items-center space-x-2 mb-1">
                                <input
                                    type="checkbox"
                                    className="form-checkbox text-blue-600 rounded"
                                    checked={filters.productType.includes(category)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters(prev => ({
                                                ...prev,
                                                productType: [...prev.productType, category]
                                            }));
                                        } else {
                                            setFilters(prev => ({
                                                ...prev,
                                                productType: prev.productType.filter(t => t !== category)
                                            }));
                                        }
                                    }}
                                />
                                <span>{category} ({mockProducts.filter(p => p.category === category).length})</span>
                            </label>
                        ))}
                    </div>

                    {/* Brand Filter */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Brand</h3>
                        {uniqueBrands.map((brand) => (
                            <label key={brand} className="flex items-center space-x-2 mb-1">
                                <input
                                    type="checkbox"
                                    className="form-checkbox text-blue-600 rounded"
                                    checked={filters.brand.includes(brand)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters(prev => ({...prev, brand: [...prev.brand, brand]}));
                                        } else {
                                            setFilters(prev => ({...prev, brand: prev.brand.filter(b => b !== brand)}));
                                        }
                                    }}
                                />
                                <span>{brand} ({mockProducts.filter(p => p.brand === brand).length})</span>
                            </label>
                        ))}
                    </div>

                    {/* Color Filter Placeholder */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Color</h3>
                        <div className="flex space-x-2">
                            <span
                                className="w-6 h-6 rounded-full bg-blue-600 border border-gray-300 cursor-pointer"></span>
                            <span
                                className="w-6 h-6 rounded-full bg-green-600 border border-gray-300 cursor-pointer"></span>
                            <span
                                className="w-6 h-6 rounded-full bg-red-600 border border-gray-300 cursor-pointer"></span>
                            <span
                                className="w-6 h-6 rounded-full bg-black border border-gray-300 cursor-pointer"></span>
                        </div>
                    </div>

                    {/* Storage Filter Placeholder */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">Storage</h3>
                        <label className="flex items-center space-x-2 mb-1">
                            <input type="checkbox" className="form-checkbox text-blue-600 rounded"/>
                            <span>64GB (2)</span>
                        </label>
                        <label className="flex items-center space-x-2 mb-1">
                            <input type="checkbox" className="form-checkbox text-blue-600 rounded"/>
                            <span>128GB (2)</span>
                        </label>
                        <label className="flex items-center space-x-2 mb-1">
                            <input type="checkbox" className="form-checkbox text-blue-600 rounded"/>
                            <span>256GB (2)</span>
                        </label>
                        <label className="flex items-center space-x-2 mb-1">
                            <input type="checkbox" className="form-checkbox text-blue-600 rounded"/>
                            <span>512GB (2)</span>
                        </label>
                    </div>
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => setProducts(applyFiltersAndSort())}
                    >
                        Apply Filters
                    </button>
                </aside>

                {/* Main Content Area for Products */}
                <main className="flex-1">
                    {/* Top bar for product count and sorting */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
                        <span className="text-gray-700">{products.length} products</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-700">Sort by:</span>
                            <select
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={sortOption}
                                onChange={(e) => {
                                    setSortOption(e.target.value as SortOption);
                                    // Apply sorting immediately when selection changes
                                    setProducts(applyFiltersAndSort());
                                }}
                            >
                                <option value="default">Best selling</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A-Z</option>
                                <option value="name-desc">Name: Z-A</option>
                            </select>
                            {/* Layout toggles (grid/list) - placeholders */}
                            <button className="p-2 border border-gray-300 rounded-md text-blue-600 hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-grid-3x3">
                                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                                    <path d="M3 9h18"/>
                                    <path d="M3 15h18"/>
                                    <path d="M9 3v18"/>
                                    <path d="M15 3v18"/>
                                </svg>
                            </button>
                            <button className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-rows">
                                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                                    <path d="M3 9h18"/>
                                    <path d="M3 15h18"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.id} product={product}/>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No products found matching your
                                criteria.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}