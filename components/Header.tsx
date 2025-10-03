
import React from 'react';
import { MusicNoteIcon, ChatIcon, SparklesIcon, MoonIcon, SunIcon, BriefcaseIcon, UserGroupIcon } from './Icons';
import { Notification, Musician } from '../types';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  currentUser: Musician;
  onLogout: () => void;
  onMyProfileClick: () => void;
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllRead: () => void;
  onToggleChat: () => void;
  unreadMessagesCount: number;
  onOpenAIGigFinder: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeView: 'musicians' | 'gigs';
  onSetView: (view: 'musicians' | 'gigs') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser,
  onLogout, 
  onMyProfileClick, 
  notifications, 
  onNotificationClick, 
  onMarkAllRead,
  onToggleChat,
  unreadMessagesCount,
  onOpenAIGigFinder,
  theme,
  onToggleTheme,
  activeView,
  onSetView,
}) => {

  const NavButton = ({ view, label, icon }: { view: 'musicians' | 'gigs', label: string, icon: React.ReactNode }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => onSetView(view)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
          isActive 
            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };


  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MusicNoteIcon className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Gig<span className="text-purple-500">Tune</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-full">
            <NavButton view="musicians" label="Find Musicians" icon={<UserGroupIcon className="w-5 h-5"/>} />
            <NavButton view="gigs" label="Gig Board" icon={<BriefcaseIcon className="w-5 h-5"/>} />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
           <button
            onClick={onOpenAIGigFinder}
            className="hidden lg:inline-flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 border border-gray-300 dark:border-gray-600 shadow-sm"
            aria-label="AI Gig Finder"
          >
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            AI Finder
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
          <button
            onClick={onToggleChat}
            className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            aria-label="Toggle chat"
          >
            <ChatIcon className="w-6 h-6" />
             {unreadMessagesCount > 0 && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
            )}
          </button>
          <NotificationCenter 
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onMarkAllRead={onMarkAllRead}
          />
          <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onMyProfileClick}
                className="flex items-center gap-2"
                aria-label="View my profile"
              >
                  <img src={currentUser.avatarUrl} alt="My Profile" className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-purple-500 transition"/>
              </button>
              <button
                onClick={onLogout}
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                aria-label="Logout"
              >
                Logout
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
