
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface InventoryLog {
  id: string;
  product_id: string;
  change_type: 'add' | 'remove' | 'order' | 'return' | 'adjustment';
  quantity_changed: number;
  previous_stock: number;
  new_stock: number;
  order_id?: string;
  triggered_by?: string;
  reason?: string;
  created_at: string;
}

export const useInventory = () => {
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getInventoryLogs = async (productId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inventory_logs')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data properly
      const typedData: InventoryLog[] = (data || []).map(log => ({
        ...log,
        change_type: log.change_type as InventoryLog['change_type']
      }));
      
      setInventoryLogs(typedData);
    } catch (error) {
      console.error('Error fetching inventory logs:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory logs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductStock = async (
    productId: string,
    newStock: number,
    reason?: string
  ) => {
    if (!user) return;

    try {
      // Get current stock first
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      // Update stock - this will trigger the inventory logging automatically
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Stock updated successfully"
      });

      // Refresh inventory logs
      await getInventoryLogs(productId);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const logInventoryChange = async (
    productId: string,
    changeType: InventoryLog['change_type'],
    quantityChanged: number,
    previousStock: number,
    newStock: number,
    orderId?: string,
    reason?: string
  ) => {
    try {
      const { error } = await supabase
        .from('inventory_logs')
        .insert({
          product_id: productId,
          change_type: changeType,
          quantity_changed: quantityChanged,
          previous_stock: previousStock,
          new_stock: newStock,
          order_id: orderId,
          triggered_by: user?.id,
          reason
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging inventory change:', error);
    }
  };

  return {
    inventoryLogs,
    isLoading,
    getInventoryLogs,
    updateProductStock,
    logInventoryChange
  };
};
