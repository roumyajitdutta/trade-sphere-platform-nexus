
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import ProductSearch from '@/components/products/ProductSearch';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import { useProducts } from '@/hooks/useProducts';
import { useProductFiltering } from '@/hooks/useProductFiltering';

const ProductListPage = () => {
  const { products, isLoading } = useProducts();
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    onlyInStock,
    setOnlyInStock,
    sortBy,
    setSortBy,
    handleReset
  } = useProductFiltering(products);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search and Filter Bar */}
        <div className="lg:w-1/4">
          <ProductSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <ProductFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onlyInStock={onlyInStock}
            setOnlyInStock={setOnlyInStock}
            onReset={handleReset}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:flex-1">
          <div className="flex justify-between items-center mb-6">
            <p>
              {isLoading ? "Loading..." : `${filteredProducts.length} products found`}
            </p>
            <ProductSort sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div>Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
              <Button className="mt-4" onClick={handleReset}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
