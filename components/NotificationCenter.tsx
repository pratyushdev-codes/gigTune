import React, { useState, useRef, useEffect } from 'react';
import { Notification } from '../types';
import { BellIcon } from './Icons';

interface NotificationCenterProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onNotificationClick, onMarkAllRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (notification: Notification) => {
    onNotificationClick(notification);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        aria-label="Toggle notifications"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-30 animate-fade-in">
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={onMarkAllRead} className="text-sm text-purple-600 hover:underline font-semibold">Mark all as read</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  onClick={() => handleItemClick(notification)}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${!notification.read ? 'bg-purple-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>}
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.summary}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notification.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-6">No new notifications.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
