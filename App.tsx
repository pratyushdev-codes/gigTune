


import React, { useState, useEffect, useCallback } from 'react';
import { Musician, Instrument, Genre, Notification, Conversation, Message, PortfolioItem, Review, Comment, Gig } from './types';
import { ALL_INSTRUMENTS, ALL_GENRES } from './constants';
import { api } from './api';
import Header from './components/Header';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import MusicianCard from './components/MusicianCard';
import ProfileModal from './components/ProfileModal';
import LoginPage, { NewProfileData } from './components/LoginPage';
import NotificationModal from './components/NotificationModal';
import ChatPanel from './components/ChatPanel';
import MediaViewerModal from './components/MediaViewerModal';
import UploadPortfolioModal from './components/UploadPortfolioModal';
import AIGigFinderModal from './components/AIGigFinderModal';
import GigBoard from './components/GigBoard';
import PostGigModal from './components/PostGigModal';
import GigDetailModal from './components/GigDetailModal';
import { useSocket } from './hooks/useSocket';

type Theme = 'light' | 'dark';
type MainView = 'musicians' | 'gigs';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<Musician | null>(null);
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [allMusiciansForLogin, setAllMusiciansForLogin] = useState<Musician[]>([]);
  
  const [filteredMusicians, setFilteredMusicians] = useState<Musician[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ instruments: string[]; genres: string[] }>({
    instruments: [],
    genres: [],
  });
  const [selectedMusician, setSelectedMusician] = useState<Musician | null>(null);
  
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Portfolio & Review state
  const [viewedMediaItem, setViewedMediaItem] = useState<PortfolioItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAIGigFinderOpen, setIsAIGigFinderOpen] = useState(false);

  // Gig Board State
  const [mainView, setMainView] = useState<MainView>('musicians');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isPostGigModalOpen, setIsPostGigModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('gigtune-theme') as Theme;
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Socket Hook for real-time chat
  const { sendMessage: sendSocketMessage, onNewMessage, joinConversations, onDataUpdated } = useSocket(currentUser?.id ?? null);

  useEffect(() => {
    // Pre-fetch musicians for login purposes. In a real app, this would be part of the auth flow.
    api.getMusicians().then(setAllMusiciansForLogin).catch(err => {
        console.error("Failed to pre-fetch musicians for login", err);
        setError("Could not connect to the service. Please try again later.");
    });
  }, []);
  
  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gigtune-theme', theme);
  }, [theme]);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [musiciansData, notificationsData, conversationsData, gigsData] = await Promise.all([
        api.getMusicians(),
        api.getNotifications(),
        api.getConversations(),
        api.getGigs(),
      ]);
      setMusicians(musiciansData);
      setNotifications(notificationsData);
      setConversations(conversationsData);
      setGigs(gigsData);
    } catch (err) {
      setError('Failed to load GigTune data. Please try refreshing the page.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create stable handlers for socket events using useCallback
  const handleDataUpdate = useCallback(() => {
    console.log('Data update signal received. Refetching all data.');
    fetchAllData();
  }, [fetchAllData]);

  const handleNewMessage = useCallback(({ conversationId, message }: { conversationId: string, message: Message }) => {
    setConversations(prev => {
        const convoExists = prev.some(c => c.id === conversationId);
        
        // If the conversation exists, update it
        if (convoExists) {
            return prev.map(convo => {
                if (convo.id === conversationId) {
                    // Just add the new message if it doesn't already exist.
                    if (!convo.messages.some(m => m.id === message.id)) {
                        return { ...convo, messages: [...convo.messages, message] };
                    }
                }
                return convo;
            });
        } else {
            // Self-healing: If a message arrives for a conversation we don't know about,
            // it means a new chat was started. Fetch all conversations to get it.
            console.log('Received message for unknown conversation, fetching conversations...');
            api.getConversations().then(setConversations);
            return prev;
        }
    });
  }, []);

  // Register these stable handlers with the socket hook
  useEffect(() => {
    onDataUpdated(handleDataUpdate);
  }, [onDataUpdated, handleDataUpdate]);

  useEffect(() => {
    onNewMessage(handleNewMessage);
  }, [onNewMessage, handleNewMessage]);


  // Join conversation rooms when conversations are loaded or changed
  useEffect(() => {
    const conversationIds = conversations.map(c => c.id);
    if (conversationIds.length > 0) {
        joinConversations(conversationIds);
    }
  }, [conversations, joinConversations]);

  const handleLogin = (email: string): Musician | null => {
    const user = allMusiciansForLogin.find(m => m.email.toLowerCase() === email.toLowerCase());
    return user || null;
  };

  const handleLoginSuccess = (user: Musician) => {
    setCurrentUser(user);
    fetchAllData();
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setMusicians([]);
    setNotifications([]);
    setConversations([]);
    setGigs([]);
    setSearchQuery('');
    setActiveFilters({ instruments: [], genres: [] });
    setIsChatPanelOpen(false);
    setIsLoading(true); // To show loader if user logs back in
  };

  const handleCreateProfile = async (data: NewProfileData) => {
    const newUser = await api.register(data);
    setAllMusiciansForLogin(prev => [...prev, newUser]); // Update list for future logins
    handleLoginSuccess(newUser);
  };
  
  const handleMyProfileClick = () => {
    if (currentUser) {
      setSelectedMusician(currentUser);
    }
  };

  const handleUpdateProfile = async (updatedProfile: Musician) => {
    const savedProfile = await api.updateMusician(updatedProfile);
    setMusicians(musicians.map(m => m.id === savedProfile.id ? savedProfile : m));
    
    if (currentUser && currentUser.id === savedProfile.id) {
      setCurrentUser(savedProfile);
    }
    setSelectedMusician(savedProfile);
  };

  const applyFilters = useCallback(() => {
    let musiciansToFilter = musicians.filter(m => m.id !== currentUser?.id);

    if (searchQuery) {
      musiciansToFilter = musiciansToFilter.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilters.instruments.length > 0) {
      musiciansToFilter = musiciansToFilter.filter(m => activeFilters.instruments.includes(m.instrument));
    }

    if (activeFilters.genres.length > 0) {
      musiciansToFilter = musiciansToFilter.filter(m =>
        m.genres.some(genre => activeFilters.genres.includes(genre))
      );
    }

    setFilteredMusicians(musiciansToFilter);
  }, [searchQuery, activeFilters, musicians, currentUser]);

  useEffect(() => {
    if(currentUser) {
        applyFilters();
    }
  }, [applyFilters, currentUser]);

  const handleSelectMusician = (musician: Musician) => {
    setSelectedMusician(musician);
  };

  const handleCloseModal = () => {
    setSelectedMusician(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
        await api.markNotificationAsRead(notification.id);
        setNotifications(prev => 
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
    }
  };
  
  const handleCloseNotificationModal = () => {
    setSelectedNotification(null);
  };
  
  const handleMarkAllRead = async () => {
    const updatedNotifications = await api.markAllNotificationsRead();
    setNotifications(updatedNotifications);
  };

  const toggleChatPanel = () => {
    setIsChatPanelOpen(prev => !prev);
    if(activeConversationId && isChatPanelOpen) {
      setActiveConversationId(null);
    }
  };

  const handleStartChat = async (otherMusician: Musician) => {
    if (!currentUser) return;

    const participantIds = [currentUser.id, otherMusician.id];
    const conversation = await api.startConversation(participantIds);

    if (!conversations.find(c => c.id === conversation.id)) {
        setConversations(prev => [...prev, conversation]);
    }
    
    setActiveConversationId(conversation.id);
    setIsChatPanelOpen(true);
    setSelectedMusician(null); // Close profile modal
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    // NO optimistic update. The server is the source of truth.
    // The message will appear for sender and receiver when the server broadcasts it back.
    sendSocketMessage({
        conversationId,
        message: {
          senderId: currentUser.id,
          text: text.trim(),
        },
    });
  };

  const handleAddPortfolioItem = async (newItem: Omit<PortfolioItem, 'id' | 'reactions'>) => {
    if (!currentUser) return;
    const itemWithReactions = { ...newItem, reactions: {} };
    const updatedProfile = await api.addPortfolioItem(currentUser.id, itemWithReactions);
    handleUpdateProfile(updatedProfile); // Re-use update logic
    setIsUploadModalOpen(false);
  };

  const handleAddReview = async (musicianId: number, rating: number, comment: string) => {
    if (!currentUser) return;
    
    const targetMusician = musicians.find(m => m.id === musicianId);
    if (!targetMusician) return;
    
    if (targetMusician.id === currentUser.id || targetMusician.reviews.some(r => r.reviewerId === currentUser.id)) {
        console.warn("Cannot review yourself or review twice.");
        return;
    }

    const newReview: Review = {
        id: Date.now(),
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        reviewerAvatarUrl: currentUser.avatarUrl,
        rating,
        comment,
        date: new Date().toISOString(),
    };

    const updatedProfile = await api.addReview(musicianId, newReview);
    handleUpdateProfile(updatedProfile);
  };
  
  const handleFollowToggle = async (targetMusicianId: number) => {
    if (!currentUser) return;
    const isFollowing = currentUser.following.includes(targetMusicianId);
    
    const result = isFollowing
        ? await api.unfollowMusician(currentUser.id, targetMusicianId)
        : await api.followMusician(currentUser.id, targetMusicianId);

    const { updatedCurrentUser, updatedTargetUser } = result;

    setCurrentUser(updatedCurrentUser);
    setMusicians(prev => prev.map(m => {
        if (m.id === updatedCurrentUser.id) return updatedCurrentUser;
        if (m.id === updatedTargetUser.id) return updatedTargetUser;
        return m;
    }));

    if(selectedMusician?.id === updatedTargetUser.id) {
        setSelectedMusician(updatedTargetUser);
    } else if (selectedMusician?.id === updatedCurrentUser.id) {
        setSelectedMusician(updatedCurrentUser);
    }
    
    const potentialNotification = (result as any).newNotification;
    if (potentialNotification && typeof potentialNotification === 'object' && 'id' in potentialNotification) {
        setNotifications(prev => [potentialNotification as Notification, ...prev]);
    }
  };
  
  const handleAddComment = async (portfolioItemId: number, commentText: string) => {
    if (!currentUser) return;

    const newComment: Omit<Comment, 'id'> = {
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatarUrl: currentUser.avatarUrl,
        text: commentText,
        date: new Date().toISOString(),
    };
    
    const updatedProfile = await api.addComment(portfolioItemId, newComment);
    handleUpdateProfile(updatedProfile);
  };

  const handleAddReaction = async (portfolioItemId: number, emoji: string) => {
    if (!currentUser) return;
    const updatedProfile = await api.addReaction(portfolioItemId, emoji, currentUser.id);
    handleUpdateProfile(updatedProfile); // Re-use update logic
  };

  const handlePostGig = async (gigData: Omit<Gig, 'id' | 'postedDate' | 'status' | 'postedByUserId'>) => {
    if (!currentUser) return;
    
    const newGig = await api.createGig({ ...gigData, postedByUserId: currentUser.id });
    setGigs(prev => [newGig, ...prev]);
    setIsPostGigModalOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const unreadMessagesCount = conversations.reduce((count, convo) => {
    const lastMessage = convo.messages[convo.messages.length - 1];
    if (lastMessage && lastMessage.senderId !== currentUser?.id) {
        return count + 1;
    }
    return count;
  }, 0);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onLoginSuccess={handleLoginSuccess} onCreateProfile={handleCreateProfile} />;
  }
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading GigTune...</p>
            </div>
        </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-red-200 dark:border-red-800">
                <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
                 <button onClick={fetchAllData} className="mt-6 bg-purple-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-purple-700">
                    Try Again
                </button>
            </div>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout} 
        onMyProfileClick={handleMyProfileClick}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllRead}
        onToggleChat={toggleChatPanel}
        unreadMessagesCount={unreadMessagesCount}
        onOpenAIGigFinder={() => setIsAIGigFinderOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeView={mainView}
        onSetView={setMainView}
      />
      <main className="container mx-auto px-4 py-8">
        {mainView === 'musicians' && (
          <div className="relative z-10">
            <SearchAndFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              instruments={ALL_INSTRUMENTS}
              genres={ALL_GENRES}
            />
          </div>
        )}
        
        <div className="mt-8 relative">
          {mainView === 'musicians' ? (
            <>
              {filteredMusicians.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMusicians.map(musician => (
                      <MusicianCard key={musician.id} musician={musician} onSelect={handleSelectMusician} />
                  ))}
                  </div>
              ) : (
                  <div className="text-center py-20 animate-fade-in">
                      <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No Musicians Found</h2>
                      <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filters.</p>
                  </div>
              )}
            </>
          ) : (
             <GigBoard 
                gigs={gigs} 
                onPostGig={() => setIsPostGigModalOpen(true)}
                onViewGig={setSelectedGig}
             />
          )}
        </div>
      </main>
      <ProfileModal 
        musician={selectedMusician} 
        onClose={handleCloseModal}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onStartChat={handleStartChat}
        onViewMedia={setViewedMediaItem}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onAddReview={handleAddReview}
        onFollowToggle={handleFollowToggle}
      />
      <NotificationModal
        notification={selectedNotification}
        onClose={handleCloseNotificationModal}
      />
      <ChatPanel
        isOpen={isChatPanelOpen}
        onClose={toggleChatPanel}
        conversations={conversations}
        musicians={musicians}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />
      <MediaViewerModal 
        item={viewedMediaItem} 
        onClose={() => setViewedMediaItem(null)} 
        currentUser={currentUser}
        onAddComment={handleAddComment}
        onAddReaction={handleAddReaction}
      />
      {isUploadModalOpen && (
          <UploadPortfolioModal
            onClose={() => setIsUploadModalOpen(false)}
            onAddItem={handleAddPortfolioItem}
          />
      )}
      {isAIGigFinderOpen && (
        <AIGigFinderModal
            onClose={() => setIsAIGigFinderOpen(false)}
            allMusicians={musicians}
            onSelectMusician={(musician) => {
                setIsAIGigFinderOpen(false);
                handleSelectMusician(musician);
            }}
        />
      )}
      {isPostGigModalOpen && (
        <PostGigModal
            onClose={() => setIsPostGigModalOpen(false)}
            onPostGig={handlePostGig}
        />
      )}
      {selectedGig && (
        <GigDetailModal
            gig={selectedGig}
            onClose={() => setSelectedGig(null)}
            musicians={musicians}
        />
      )}
    </div>
  );
};

export default App;