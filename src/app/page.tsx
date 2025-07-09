"use client";

import Navbar from "@/components/Navbar";
import ProductCard, { Product } from "@/components/ProductCard";
import { mockProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCallback, useEffect, useState } from "react";
import { XCircle } from "lucide-react";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "default";

interface ProductFilters {
  inStock: boolean;
  outOfStock: boolean;
  priceRange: { min: number; max: number };
  productType: string[];
  brand: string[];
}

type FilterChangeValue =
  | boolean
  | number
  | string
  | { min?: number; max?: number };

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(mockProducts);

  const initialMaxPrice = Math.max(...mockProducts.map((p) => p.price));
  const initialMinPrice = Math.min(...mockProducts.map((p) => p.price));

  const [filters, setFilters] = useState<ProductFilters>({
    inStock: false,
    outOfStock: false,
    priceRange: { min: initialMinPrice, max: initialMaxPrice },
    productType: [],
    brand: [],
  });

  const [sortOption, setSortOption] = useState<SortOption>("default");

  const applyFiltersAndSort = useCallback(
    (currentFilters: ProductFilters, currentSortOption: SortOption) => {
      const filtered = mockProducts.filter((product) => {
        if (currentFilters.inStock && !product.isInStock) {
          return false;
        }
        if (currentFilters.outOfStock && product.isInStock) {
          return false;
        }

        if (
          product.price < currentFilters.priceRange.min ||
          product.price > currentFilters.priceRange.max
        ) {
          return false;
        }

        if (
          currentFilters.productType.length > 0 &&
          !currentFilters.productType.includes(product.category)
        ) {
          return false;
        }

        if (
          currentFilters.brand.length > 0 &&
          !currentFilters.brand.includes(product.brand)
        ) {
          return false;
        }

        return true;
      });

      filtered.sort((a, b) => {
        if (currentSortOption === "price-asc") {
          return a.price - b.price;
        }
        if (currentSortOption === "price-desc") {
          return b.price - a.price;
        }
        if (currentSortOption === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        if (currentSortOption === "name-desc") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });

      return filtered;
    },
    [],
  );

  useEffect(() => {
    setProducts(applyFiltersAndSort(filters, sortOption));
  }, [filters, sortOption, applyFiltersAndSort]);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };

  const handleFilterChange = (
    filterName: keyof ProductFilters | "inStock" | "outOfStock",
    value: FilterChangeValue,
  ) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (filterName === "inStock") {
        newFilters.inStock = value as boolean;
        if (value) {
          newFilters.outOfStock = false;
        }
      } else if (filterName === "outOfStock") {
        newFilters.outOfStock = value as boolean;
        if (value) {
          newFilters.inStock = false;
        }
      } else if (filterName === "productType" || filterName === "brand") {
        const stringValue = value as string;
        const currentArray = prevFilters[filterName];
        if (currentArray.includes(stringValue)) {
          newFilters[filterName] = currentArray.filter(
            (item) => item !== stringValue,
          );
        } else {
          newFilters[filterName] = [...currentArray, stringValue];
        }
      } else if (filterName === "priceRange") {
        newFilters.priceRange = {
          ...prevFilters.priceRange,
          ...(value as { min?: number; max?: number }),
        };
      }
      return newFilters;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  const handleRemoveFilters = () => {
    setFilters({
      inStock: false,
      outOfStock: false,
      priceRange: { min: initialMinPrice, max: initialMaxPrice },
      productType: [],
      brand: [],
    });
    setSortOption("default");
  };

  const uniqueCategories = Array.from(
    new Set(mockProducts.map((p) => p.category)),
  );
  const uniqueBrands = Array.from(new Set(mockProducts.map((p) => p.brand)));

  const isFilterActive =
    filters.inStock ||
    filters.outOfStock ||
    filters.productType.length > 0 ||
    filters.brand.length > 0 ||
    filters.priceRange.min !== initialMinPrice ||
    filters.priceRange.max !== initialMaxPrice ||
    sortOption !== "default";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartItemCount={0} />

      <div className="container mx-auto p-4 flex gap-6 mt-4">
        <aside className="w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filter</h2>
            {isFilterActive && (
              <button
                onClick={handleRemoveFilters}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                aria-label="Clear all filters and sorting"
              >
                <XCircle size={16} />
                Clear All
              </button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Availability</h3>
            <label
              htmlFor="inStockFilter"
              className="flex items-center space-x-2 mb-1 cursor-pointer"
            >
              <input
                type="checkbox"
                id="inStockFilter"
                className="form-checkbox text-blue-600 rounded"
                checked={filters.inStock}
                onChange={(e) =>
                  handleFilterChange("inStock", e.target.checked)
                }
              />
              <span>
                In stock ({mockProducts.filter((p) => p.isInStock).length})
              </span>
            </label>
            <label
              htmlFor="outOfStockFilter"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                id="outOfStockFilter"
                className="form-checkbox text-blue-600 rounded"
                checked={filters.outOfStock}
                onChange={(e) =>
                  handleFilterChange("outOfStock", e.target.checked)
                }
              />
              <span>
                Out of stock ({mockProducts.filter((p) => !p.isInStock).length})
              </span>
            </label>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Price</h3>
            <p className="text-sm text-gray-500 mb-2">
              The highest price is ${initialMaxPrice.toFixed(2)}
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="minPrice"
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.priceRange.min}
                onChange={(e) =>
                  handleFilterChange("priceRange", {
                    min: Number(e.target.value),
                  })
                }
              />
              <span aria-hidden="true">-</span>
              <input
                type="number"
                id="maxPrice"
                placeholder="Max"
                className="w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.priceRange.max}
                onChange={(e) =>
                  handleFilterChange("priceRange", {
                    max: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Product type</h3>
            {uniqueCategories.map((category) => (
              <label
                key={category}
                htmlFor={`category-${category}`}
                className="flex items-center space-x-2 mb-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  className="form-checkbox text-blue-600 rounded"
                  checked={filters.productType.includes(category)}
                  onChange={() => handleFilterChange("productType", category)}
                />
                <span>
                  {category} (
                  {mockProducts.filter((p) => p.category === category).length})
                </span>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Brand</h3>
            {uniqueBrands.map((brand) => (
              <label
                key={brand}
                htmlFor={`brand-${brand}`}
                className="flex items-center space-x-2 mb-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  className="form-checkbox text-blue-600 rounded"
                  checked={filters.brand.includes(brand)}
                  onChange={() => handleFilterChange("brand", brand)}
                />
                <span>
                  {brand} (
                  {mockProducts.filter((p) => p.brand === brand).length})
                </span>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Color</h3>
            <div className="flex space-x-2">
              <span
                key="blue-color-filter"
                className="w-6 h-6 rounded-full bg-blue-600 border border-gray-300 cursor-pointer"
                role="button"
                aria-label="Filter by Blue color"
              ></span>
              <span
                key="green-color-filter"
                className="w-6 h-6 rounded-full bg-green-600 border border-gray-300 cursor-pointer"
                role="button"
                aria-label="Filter by Green color"
              ></span>
              <span
                key="red-color-filter"
                className="w-6 h-6 rounded-full bg-red-600 border border-gray-300 cursor-pointer"
                role="button"
                aria-label="Filter by Red color"
              ></span>
              <span
                key="black-color-filter"
                className="w-6 h-6 rounded-full bg-black border border-gray-300 cursor-pointer"
                role="button"
                aria-label="Filter by Black color"
              ></span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Storage</h3>
            <label
              key="64gb-storage"
              htmlFor="storage-64gb"
              className="flex items-center space-x-2 mb-1 cursor-pointer"
            >
              <input
                type="checkbox"
                id="storage-64gb"
                className="form-checkbox text-blue-600 rounded"
              />
              <span>64GB (2)</span>
            </label>
            <label
              key="128gb-storage"
              htmlFor="storage-128gb"
              className="flex items-center space-x-2 mb-1 cursor-pointer"
            >
              <input
                type="checkbox"
                id="storage-128gb"
                className="form-checkbox text-blue-600 rounded"
              />
              <span>128GB (2)</span>
            </label>
            <label
              key="256gb-storage"
              htmlFor="storage-256gb"
              className="flex items-center space-x-2 mb-1 cursor-pointer"
            >
              <input
                type="checkbox"
                id="storage-256gb"
                className="form-checkbox text-blue-600 rounded"
              />
              <span>256GB (2)</span>
            </label>
            <label
              key="512gb-storage"
              htmlFor="storage-512gb"
              className="flex items-center space-x-2 mb-1 cursor-pointer"
            >
              <input
                type="checkbox"
                id="storage-512gb"
                className="form-checkbox text-blue-600 rounded"
              />
              <span>512GB (2)</span>
            </label>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
            <span className="text-gray-700">{products.length} products</span>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-gray-700">
                Sort by:
              </label>
              <select
                id="sort-select"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="default">Best selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
              <button
                className="p-2 border border-gray-300 rounded-md text-blue-600 hover:bg-gray-100"
                aria-label="Display as grid with 3 columns"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-grid-3x3"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                  <path d="M9 3v18" />
                  <path d="M15 3v18" />
                </svg>
              </button>
              <button
                className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100"
                aria-label="Display as list with rows"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-rows"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found matching your criteria.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
