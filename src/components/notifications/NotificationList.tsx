
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const NotificationList = () => {
  const { notifications, markAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No notifications yet
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-lg border ${
            notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                {!notification.read && (
                  <Badge variant="default" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(notification.id)}
                className="text-xs"
              >
                Mark read
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
