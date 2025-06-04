
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import SearchBar from '@/components/search/SearchBar';
import ProductGrid from '@/components/products/ProductGrid';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

const categories = [
  "Electronics",
  "Clothing", 
  "Home & Kitchen",
  "Books",
  "Toys & Games",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Automotive",
  "Health",
  "Pet Supplies"
];

const sortOptions = [
  { label: "Most Relevant", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Best Rating", value: "rating_desc" },
];

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query, selectedCategories, priceRange, onlyInStock, minRating, sortBy]);

  const fetchSearchResults = async () => {
    try {
      setIsLoading(true);
      
      let queryBuilder = supabase
        .from('products')
        .select('*');

      // Text search
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%`
        );
      }

      // Category filter
      if (selectedCategories.length > 0) {
        queryBuilder = queryBuilder.in('category', selectedCategories);
      }

      // Price range filter
      queryBuilder = queryBuilder
        .gte('price', priceRange[0])
        .lte('price', priceRange[1]);

      // Stock filter
      if (onlyInStock) {
        queryBuilder = queryBuilder.gt('stock', 0);
      }

      // Rating filter
      if (minRating > 0) {
        queryBuilder = queryBuilder.gte('rating', minRating);
      }

      // Sorting
      switch (sortBy) {
        case 'price_asc':
          queryBuilder = queryBuilder.order('price', { ascending: true });
          break;
        case 'price_desc':
          queryBuilder = queryBuilder.order('price', { ascending: false });
          break;
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
          break;
        case 'rating_desc':
          queryBuilder = queryBuilder.order('rating', { ascending: false });
          break;
        default:
          // For relevance, we'll order by a combination of factors
          queryBuilder = queryBuilder.order('featured', { ascending: false })
                                   .order('rating', { ascending: false });
          break;
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      // Transform the data
      const transformedProducts = (data || []).map(product => ({
        id: product.id,
        sellerId: product.seller_id,
        sellerName: product.seller_name,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        images: Array.isArray(product.images) ? product.images : [product.images].filter(Boolean),
        category: product.category,
        stock: product.stock,
        rating: Number(product.rating || 0),
        reviewCount: product.review_count || 0,
        featured: product.featured || false,
        createdAt: product.created_at
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast({
        title: "Error",
        description: "Failed to load search results",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setOnlyInStock(false);
    setMinRating(0);
  };

  const activeFiltersCount = selectedCategories.length + 
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar className="w-full max-w-2xl mx-auto" />
      </div>

      {/* Search Results Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-gray-600">
            {isLoading ? "Searching..." : `${products.length} products found`}
          </p>
          
          <div className="flex items-center gap-4">
            {/* Mobile Filters */}
            <div className="sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 px-1.5 py-0.5 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results</SheetDescription>
                  </SheetHeader>
                  {/* Mobile filter content would go here */}
                </SheetContent>
              </Sheet>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label 
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={1000}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`rating-${rating}`}
                        checked={minRating === rating}
                        onCheckedChange={(checked) => 
                          setMinRating(checked ? rating : 0)
                        }
                      />
                      <Label htmlFor={`rating-${rating}`} className="text-sm">
                        {rating}+ Stars
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-medium mb-3">Availability</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock"
                    checked={onlyInStock}
                    onCheckedChange={(checked) => setOnlyInStock(checked as boolean)}
                  />
                  <Label htmlFor="in-stock" className="text-sm">
                    In Stock Only
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Searching for products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Sorry, we couldn't find any products matching "{query}"
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Try:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using different keywords</li>
                  <li>• Browsing our categories</li>
                </ul>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
