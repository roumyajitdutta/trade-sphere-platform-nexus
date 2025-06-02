
export interface Notification {
  id: string;
  user_id: string;
  type: 'order_placed' | 'order_accepted' | 'order_rejected' | 'order_shipped';
  title: string;
  message: string;
  order_id?: string;
  read: boolean;
  created_at: string;
}
