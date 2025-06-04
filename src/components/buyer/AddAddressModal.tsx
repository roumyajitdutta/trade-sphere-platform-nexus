
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const addressSchema = z.object({
  address_line1: z.string().min(1, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  is_default: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface ShippingAddress {
  id: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress?: ShippingAddress | null;
  onAddressChange: () => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  editingAddress,
  onAddressChange,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'United States',
      is_default: false,
    },
  });

  const isDefault = watch('is_default');

  React.useEffect(() => {
    if (editingAddress) {
      reset({
        address_line1: editingAddress.address_line1,
        address_line2: editingAddress.address_line2 || '',
        city: editingAddress.city,
        state: editingAddress.state,
        postal_code: editingAddress.postal_code,
        country: editingAddress.country,
        is_default: editingAddress.is_default,
      });
    } else {
      reset({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'United States',
        is_default: false,
      });
    }
  }, [editingAddress, reset, isOpen]);

  const onSubmit = async (data: AddressFormData) => {
    if (!user) return;

    try {
      if (data.is_default) {
        // Remove default from all other addresses first
        await supabase
          .from('shipping_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('shipping_addresses')
          .update({
            address_line1: data.address_line1,
            address_line2: data.address_line2 || null,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
            country: data.country,
            is_default: data.is_default,
          })
          .eq('id', editingAddress.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        // Create new address
        const { error } = await supabase
          .from('shipping_addresses')
          .insert({
            user_id: user.id,
            address_line1: data.address_line1,
            address_line2: data.address_line2 || null,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
            country: data.country,
            is_default: data.is_default,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      onAddressChange();
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogDescription>
            {editingAddress ? 'Update your shipping address below.' : 'Add a new shipping address to your account.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1 *</Label>
            <Input
              id="address_line1"
              {...register('address_line1')}
              placeholder="Street address"
            />
            {errors.address_line1 && (
              <p className="text-sm text-red-600">{errors.address_line1.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              {...register('address_line2')}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="City"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="State"
              />
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                {...register('postal_code')}
                placeholder="ZIP/Postal Code"
              />
              {errors.postal_code && (
                <p className="text-sm text-red-600">{errors.postal_code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                {...register('country')}
                placeholder="Country"
              />
              {errors.country && (
                <p className="text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={isDefault}
              onCheckedChange={(checked) => setValue('is_default', !!checked)}
            />
            <Label htmlFor="is_default">Set as default address</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
