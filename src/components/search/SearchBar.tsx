
import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

interface SearchSuggestion {
  type: 'product' | 'category' | 'recent' | 'popular';
  id: string;
  text: string;
  image?: string;
  price?: number;
  category?: string;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search for products, brands, or categories",
  className = "",
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Popular categories and recent searches (in a real app, these would come from backend)
  const popularSearches = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      fetchSuggestions(query);
    } else {
      setIsOpen(query.length > 0);
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id, title, images, price, category')
        .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%, category.ilike.%${searchQuery}%`)
        .limit(5);

      const productSuggestions: SearchSuggestion[] = (products || []).map(product => ({
        type: 'product' as const,
        id: product.id,
        text: product.title,
        image: Array.isArray(product.images) ? product.images[0] : product.images,
        price: product.price,
        category: product.category
      }));

      // Add category suggestions
      const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];
      const categorySuggestions: SearchSuggestion[] = categories
        .filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(cat => ({
          type: 'category' as const,
          id: cat,
          text: cat
        }));

      setSuggestions([...productSuggestions, ...categorySuggestions]);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      // Save to recent searches
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [finalQuery, ...recent.filter((item: string) => item !== finalQuery)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      setIsOpen(false);
      onSearch?.(finalQuery);
      navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/products/${suggestion.id}`);
    } else {
      setQuery(suggestion.text);
      handleSearch(suggestion.text);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const showDefaultSuggestions = query.length === 0 && isOpen;

  return (
    <div ref={searchRef} className={`relative w-full max-w-lg ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-10 py-3 text-base"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <span className="mt-2 block">Searching...</span>
            </div>
          )}

          {showDefaultSuggestions && (
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </div>
                  {recentSearches.slice(0, 3).map((search: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-left"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  Popular Searches
                </div>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-left"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showDefaultSuggestions && suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-left"
                >
                  {suggestion.type === 'product' && suggestion.image && (
                    <img
                      src={suggestion.image}
                      alt={suggestion.text}
                      className="w-10 h-10 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </div>
                    {suggestion.type === 'product' && suggestion.price && (
                      <div className="text-sm text-gray-600">
                        ${suggestion.price.toFixed(2)}
                        {suggestion.category && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {suggestion.category}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Search className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {!isLoading && !showDefaultSuggestions && suggestions.length === 0 && query.length > 1 && (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No suggestions found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
