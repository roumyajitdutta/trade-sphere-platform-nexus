
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Form schema
const productFormSchema = z.object({
  title: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Price must be a positive number",
  }),
  stock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  category: z.string().min(1, { message: "Please select a category" }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Predefined categories
const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Books",
  "Toys",
  "Beauty",
  "Sports",
  "Automotive",
  "Other"
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to add a product",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      // Upload images if there are any new ones
      const finalImageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        // Upload each image and track progress
        let completed = 0;
        
        for (const file of imageFiles) {
          const fileName = `${user.id}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw new Error(`Error uploading image: ${uploadError.message}`);
          }

          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          finalImageUrls.push(urlData.publicUrl);
          
          // Update progress
          completed++;
          setUploadProgress(Math.round((completed / imageFiles.length) * 100));
        }
      }

      if (finalImageUrls.length === 0) {
        // Add a placeholder image if no images were uploaded
        finalImageUrls.push('/placeholder.svg');
      }

      // Add the product to the database
      const { data: product, error } = await supabase
        .from('products')
        .insert([
          {
            seller_id: user.id,
            seller_name: user.name || user.email || 'Unknown Seller',
            title: data.title,
            description: data.description,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            category: data.category,
            images: finalImageUrls,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      navigate('/seller/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: File[] = Array.from(files);
      setImageFiles([...imageFiles, ...newFiles]);
      
      // Create preview URLs
      const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    const newImageFiles = [...imageFiles];
    
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);
    
    newImageUrls.splice(index, 1);
    newImageFiles.splice(index, 1);
    
    setImageUrls(newImageUrls);
    setImageFiles(newImageFiles);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0.01" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="1" 
                          placeholder="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Product Images</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleImageChange} 
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500 mt-2">Upload product images (PNG, JPG, WEBP)</p>
                </div>
                
                {/* Image previews */}
                {imageUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="flex flex-wrap gap-3">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative w-24 h-24 group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/seller/products')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
