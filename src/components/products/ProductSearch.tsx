
import React from 'react';
import { Search } from 'lucide-react';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ProductSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically applied through the effect in parent component
  };

  return (
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
  );
};

export default ProductSearch;
