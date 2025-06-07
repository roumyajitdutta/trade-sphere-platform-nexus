
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PaymentTransaction {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'refunded';
  payment_method: string;
  gateway?: string;
  transaction_id?: string;
  gateway_response?: any;
  created_at: string;
  updated_at: string;
}

export const usePayments = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchTransactions = async (userId?: string) => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load payment transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (
    orderId: string,
    amount: number,
    paymentMethod: string,
    currency: string = 'USD'
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          order_id: orderId,
          amount,
          currency,
          status: 'pending',
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to create payment transaction",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateTransactionStatus = async (
    transactionId: string,
    status: PaymentTransaction['status'],
    gatewayResponse?: any,
    externalTransactionId?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .update({
          status,
          gateway_response: gatewayResponse,
          transaction_id: externalTransactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? data : t)
      );

      return data;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  return {
    transactions,
    isLoading,
    fetchTransactions,
    createTransaction,
    updateTransactionStatus
  };
};
