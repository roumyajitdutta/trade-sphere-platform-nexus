
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  // Mock specifications based on category
  const getSpecifications = () => {
    const baseSpecs = {
      'Brand': product.sellerName,
      'Category': product.category,
      'Stock': product.stock.toString(),
      'Rating': `${product.rating}/5.0`,
      'Product ID': product.id.substring(0, 8).toUpperCase(),
    };

    // Add category-specific specs
    switch (product.category.toLowerCase()) {
      case 'electronics':
        return {
          ...baseSpecs,
          'Warranty': '1 Year Manufacturer Warranty',
          'Power Source': 'AC/DC Adapter',
          'Connectivity': 'Wi-Fi, Bluetooth',
          'Material': 'Premium Plastic & Metal',
        };
      case 'clothing':
        return {
          ...baseSpecs,
          'Material': '100% Cotton',
          'Care Instructions': 'Machine wash cold',
          'Fit': 'Regular Fit',
          'Country of Origin': 'India',
        };
      case 'home & kitchen':
        return {
          ...baseSpecs,
          'Material': 'Stainless Steel',
          'Dishwasher Safe': 'Yes',
          'Warranty': '2 Years',
          'Capacity': 'Medium',
        };
      default:
        return {
          ...baseSpecs,
          'Material': 'High Quality Materials',
          'Warranty': '1 Year Limited Warranty',
          'Country of Origin': 'Various',
          'Certification': 'Quality Assured',
        };
    }
  };

  const specifications = getSpecifications();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-700">{key}</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
          <p className="text-sm text-gray-600">
            {product.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSpecifications;
