
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const paymentSchema = z.object({
  card_number: z.string().min(16, 'Card number must be at least 16 digits').max(19, 'Card number is too long'),
  cardholder_name: z.string().min(1, 'Cardholder name is required'),
  expiry_month: z.number().min(1).max(12),
  expiry_year: z.number().min(new Date().getFullYear()),
  cvv: z.string().min(3, 'CVV must be at least 3 digits').max(4, 'CVV is too long'),
  card_type: z.string().min(1, 'Card type is required'),
  is_default: z.boolean().default(false),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodChange: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentMethodChange,
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
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      card_number: '',
      cardholder_name: '',
      expiry_month: new Date().getMonth() + 1,
      expiry_year: new Date().getFullYear(),
      cvv: '',
      card_type: '',
      is_default: false,
    },
  });

  const isDefault = watch('is_default');
  const cardNumber = watch('card_number');

  // Detect card type based on card number
  React.useEffect(() => {
    const detectCardType = (number: string) => {
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.startsWith('4')) return 'Visa';
      if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
      if (cleaned.startsWith('3')) return 'American Express';
      if (cleaned.startsWith('6')) return 'Discover';
      return '';
    };

    if (cardNumber) {
      const type = detectCardType(cardNumber);
      if (type) {
        setValue('card_type', type);
      }
    }
  }, [cardNumber, setValue]);

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted;
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!user) return;

    try {
      const lastFourDigits = data.card_number.replace(/\D/g, '').slice(-4);

      if (data.is_default) {
        // Remove default from all other payment methods first
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          card_type: data.card_type,
          last_four_digits: lastFourDigits,
          expiry_month: data.expiry_month,
          expiry_year: data.expiry_year,
          cardholder_name: data.cardholder_name,
          is_default: data.is_default,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment method added successfully",
      });

      onPaymentMethodChange();
      onClose();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Payment Method</DialogTitle>
          <DialogDescription>
            Add a new credit or debit card to your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card_number">Card Number *</Label>
            <Input
              id="card_number"
              {...register('card_number')}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                e.target.value = formatted;
              }}
            />
            {errors.card_number && (
              <p className="text-sm text-red-600">{errors.card_number.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholder_name">Cardholder Name *</Label>
            <Input
              id="cardholder_name"
              {...register('cardholder_name')}
              placeholder="John Doe"
            />
            {errors.cardholder_name && (
              <p className="text-sm text-red-600">{errors.cardholder_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Expiry Month *</Label>
              <Select
                value={watch('expiry_month')?.toString()}
                onValueChange={(value) => setValue('expiry_month', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expiry_month && (
                <p className="text-sm text-red-600">{errors.expiry_month.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Expiry Year *</Label>
              <Select
                value={watch('expiry_year')?.toString()}
                onValueChange={(value) => setValue('expiry_year', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expiry_year && (
                <p className="text-sm text-red-600">{errors.expiry_year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                {...register('cvv')}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && (
                <p className="text-sm text-red-600">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Card Type</Label>
            <Select
              value={watch('card_type')}
              onValueChange={(value) => setValue('card_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="Mastercard">Mastercard</SelectItem>
                <SelectItem value="American Express">American Express</SelectItem>
                <SelectItem value="Discover">Discover</SelectItem>
              </SelectContent>
            </Select>
            {errors.card_type && (
              <p className="text-sm text-red-600">{errors.card_type.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={isDefault}
              onCheckedChange={(checked) => setValue('is_default', !!checked)}
            />
            <Label htmlFor="is_default">Set as default payment method</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Payment Method'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
