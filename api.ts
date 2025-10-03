import { Musician, Notification, Conversation, Message, Review, PortfolioItem, ExperienceLevel, Comment, NotificationType, Gig } from './types';
import { NewProfileData } from './components/LoginPage.tsx';
import { API_BASE_URL } from './config';

// A generic fetch handler to reduce boilerplate code.
// It handles JSON parsing, headers, and basic error handling.
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const { method = 'GET', body } = options;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    // In a real app, you would include an auth token here
    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    // Try to parse error message from backend, otherwise use default
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  // Handle responses that might not have a body (e.g., a 204 No Content)
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (null as unknown as T);
};

export const api = {
  // --- Auth ---
  
  async login(email: string, password_not_used: string): Promise<Musician> {
    const body = JSON.stringify({ email }); // Password check is handled server-side
    return apiFetch<Musician>('/login', { method: 'POST', body });
  },

  async register(data: NewProfileData): Promise<Musician> {
    const body = JSON.stringify(data);
    const newUser = await apiFetch<Musician>('/register', { method: 'POST', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString()); // Trigger refresh in other tabs
    return newUser;
  },

  // --- READ Operations ---
  
  async getMusicians(): Promise<Musician[]> {
    return apiFetch<Musician[]>('/musicians');
  },
  
  async getNotifications(): Promise<Notification[]> {
    return apiFetch<Notification[]>('/notifications');
  },
  
  async getConversations(): Promise<Conversation[]> {
    return apiFetch<Conversation[]>('/conversations');
  },
  
  async getGigs(): Promise<Gig[]> {
    return apiFetch<Gig[]>('/gigs');
  },

  // --- WRITE Operations ---

  async updateMusician(updatedProfile: Musician): Promise<Musician> {
    const body = JSON.stringify(updatedProfile);
    const musician = await apiFetch<Musician>(`/musicians/${updatedProfile.id}`, { method: 'PUT', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString());
    return musician;
  },
  
  async markNotificationAsRead(notificationId: number): Promise<Notification> {
    return apiFetch<Notification>(`/notifications/${notificationId}/read`, { method: 'PATCH' });
  },
  
  async markAllNotificationsRead(): Promise<Notification[]> {
    return apiFetch<Notification[]>(`/notifications/read-all`, { method: 'POST' });
  },

  async startConversation(participantIds: number[]): Promise<Conversation> {
    const body = JSON.stringify({ participantIds });
    const conversation = await apiFetch<Conversation>('/conversations', { method: 'POST', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString()); // Trigger refresh in other tabs
    return conversation;
  },
  
  async addPortfolioItem(userId: number, item: Omit<PortfolioItem, 'id' | 'comments' | 'reactions'>): Promise<Musician> {
    const body = JSON.stringify(item);
    const musician = await apiFetch<Musician>(`/musicians/${userId}/portfolio`, { method: 'POST', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString());
    return musician;
  },

  async addReview(musicianId: number, newReview: Omit<Review, 'id' | 'date'>): Promise<Musician> {
    const body = JSON.stringify(newReview);
    const musician = await apiFetch<Musician>(`/musicians/${musicianId}/reviews`, { method: 'POST', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString());
    return musician;
  },

  async followMusician(currentUserId: number, targetUserId: number) {
    const body = JSON.stringify({ currentUserId });
    const result = await apiFetch<any>(`/musicians/${targetUserId}/follow`, { method: 'POST', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString());
    return result;
  },

  async unfollowMusician(currentUserId: number, targetUserId: number) {
     const body = JSON.stringify({ currentUserId });
     const result = await apiFetch<any>(`/musicians/${targetUserId}/unfollow`, { method: 'POST', body });
     localStorage.setItem('gigtune-data-trigger', Date.now().toString());
     return result;
  },

  async addComment(portfolioItemId: number, newComment: Omit<Comment, 'id'| 'date'>): Promise<Musician> {
    const body = JSON.stringify(newComment);
    const musician = await apiFetch<Musician>(`/portfolio/${portfolioItemId}/comments`, { method: 'POST', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString());
    return musician;
  },
  
  async addReaction(portfolioItemId: number, emoji: string, userId: number): Promise<Musician> {
    const body = JSON.stringify({ userId, emoji });
    const musician = await apiFetch<Musician>(`/portfolio/${portfolioItemId}/reactions`, { method: 'POST', body });
    localStorage.setItem('gigtune-data-trigger', Date.now().toString());
    return musician;
  },
  
  async createGig(gigData: Omit<Gig, 'id' | 'postedDate' | 'status'>): Promise<Gig> {
      const body = JSON.stringify(gigData);
      const gig = await apiFetch<Gig>('/gigs', { method: 'POST', body });
      localStorage.setItem('gigtune-data-trigger', Date.now().toString());
      return gig;
  }
};