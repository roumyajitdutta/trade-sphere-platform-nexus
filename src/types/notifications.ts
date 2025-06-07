
export interface Notification {
  id: string;
  user_id: string;
  type: 'new_order' | 'order_accepted' | 'order_rejected' | 'order_shipped' | 'order_delivered' | 'promo' | 'system';
  title: string;
  message: string;
  order_id?: string;
  read: boolean;
  created_at: string;
}
