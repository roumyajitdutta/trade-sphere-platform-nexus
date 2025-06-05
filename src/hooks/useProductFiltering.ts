
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';

export const useProductFiltering = (products: Product[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Apply filters and sorting
  useEffect(() => {
    console.log('Applying filters to products:', products.length);
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', result.length);
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
      console.log('After category filter:', result.length);
    }
    
    // Apply price range filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    console.log('After price filter:', result.length);
    
    // Apply stock filter
    if (onlyInStock) {
      result = result.filter(product => product.stock > 0);
      console.log('After stock filter:', result.length);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    console.log('Final filtered products:', result.length);
    setFilteredProducts(result);
    
    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);
    setSearchParams(params);
    
  }, [products, searchTerm, selectedCategory, priceRange, onlyInStock, sortBy, setSearchParams]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setOnlyInStock(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return {
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
  };
};
