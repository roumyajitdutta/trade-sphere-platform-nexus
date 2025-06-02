
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import {
  Slider
} from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating: High to Low", value: "rating_desc" },
];

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching products from Supabase...');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Raw products data from Supabase:', data);

        // Transform the data to match our Product type
        const transformedProducts = data.map(product => ({
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

        console.log('Transformed products:', transformedProducts);
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    
  }, [products, searchTerm, selectedCategory, priceRange, onlyInStock, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically applied through the effect
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setOnlyInStock(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search and Filter Bar */}
        <div className="lg:w-1/4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Desktop Filters */}
          <Card className="hidden lg:block">
            <CardContent className="divide-y p-4">
              <div className="pb-4">
                <h3 className="font-semibold mb-3">Category</h3>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="py-4">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock" 
                    checked={onlyInStock} 
                    onCheckedChange={(checked) => 
                      setOnlyInStock(checked as boolean)
                    }
                  />
                  <Label htmlFor="in-stock">In Stock Only</Label>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleReset}
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Filters Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="font-semibold mb-3">Category</h3>
                    <Select 
                      value={selectedCategory} 
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 1000]}
                        max={1000}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Availability</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="in-stock-mobile" 
                        checked={onlyInStock} 
                        onCheckedChange={(checked) => 
                          setOnlyInStock(checked as boolean)
                        }
                      />
                      <Label htmlFor="in-stock-mobile">In Stock Only</Label>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="w-1/2"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <SheetClose asChild>
                      <Button className="w-1/2">Apply Filters</Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:flex-1">
          <div className="flex justify-between items-center mb-6">
            <p>
              {isLoading ? "Loading..." : `${filteredProducts.length} products found`}
            </p>
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
