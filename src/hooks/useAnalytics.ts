
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackProductView = async (productId: string, sessionId?: string) => {
    try {
      const { error } = await supabase
        .from('product_views')
        .insert({
          product_id: productId,
          user_id: user?.id || null,
          session_id: sessionId || crypto.randomUUID(),
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error tracking product view:', error);
      }
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  };

  const logUserActivity = async (
    activityType: string,
    description?: string,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          description,
          metadata,
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging user activity:', error);
      }
    } catch (error) {
      console.error('Failed to log user activity:', error);
    }
  };

  const getSalesAnalytics = async (sellerId: string, dateRange?: { from: Date; to: Date }) => {
    try {
      let query = supabase
        .from('sales_summary')
        .select('*')
        .eq('seller_id', sellerId)
        .order('date', { ascending: false });

      if (dateRange) {
        query = query
          .gte('date', dateRange.from.toISOString().split('T')[0])
          .lte('date', dateRange.to.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      return [];
    }
  };

  const getProductViews = async (productId: string, dateRange?: { from: Date; to: Date }) => {
    try {
      let query = supabase
        .from('product_views')
        .select('*')
        .eq('product_id', productId)
        .order('viewed_at', { ascending: false });

      if (dateRange) {
        query = query
          .gte('viewed_at', dateRange.from.toISOString())
          .lte('viewed_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching product views:', error);
      return [];
    }
  };

  return {
    trackProductView,
    logUserActivity,
    getSalesAnalytics,
    getProductViews
  };
};
