import React from 'react';
import { Notification } from '../types';
import { CloseIcon } from './Icons';

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-20"
          aria-label="Close notification"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div className="p-8">
            <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                {notification.type}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{notification.title}</h2>
            <p className="text-sm text-gray-500 mb-6">
                Posted on {new Date(notification.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="text-gray-700 leading-relaxed space-y-4">
                <p>{notification.details}</p>
            </div>
            
             <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition-colors">
                    Close
                </button>
                <a href="#" className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700 transition-colors">
                    Respond
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
