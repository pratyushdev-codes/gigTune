export enum Instrument {
  GUITAR = 'Guitar',
  BASS = 'Bass',
  DRUMS = 'Drums',
  VOCALS = 'Vocals',
  KEYBOARD = 'Keyboard',
  VIOLIN = 'Violin',
  SAXOPHONE = 'Saxophone',
  TRUMPET = 'Trumpet',
  CELLO = 'Cello',
}

export enum Genre {
  ROCK = 'Rock',
  JAZZ = 'Jazz',
  POP = 'Pop',
  METAL = 'Metal',
  FUNK = 'Funk',
  CLASSICAL = 'Classical',
  ELECTRONIC = 'Electronic',
  BLUES = 'Blues',
  HIPHOP = 'Hip Hop',
  TECHNO = 'Techno',
  LATIN_ROCK = 'Latin Rock',
}

export enum ExperienceLevel {
    HOBBYIST = 'Hobbyist',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced',
    PROFESSIONAL = 'Professional',
}

export enum PortfolioItemType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  AUDIO = 'Audio',
}

export interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  date: string; // ISO string
}

export interface PortfolioItem {
  id: number;
  type: PortfolioItemType;
  url: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  comments: Comment[];
  reactions: { [emoji: string]: number[] }; // e.g. { '🔥': [1, 5, 12] }
}

export interface Review {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewerAvatarUrl: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO string
}

export interface Musician {
  id: number;
  name: string;
  isVerified?: boolean;
  location: string;
  instrument: Instrument;
  genres: Genre[];
  experienceLevel: ExperienceLevel;
  avatarUrl: string;
  bio: string;
  email: string;
  expertise: string[];
  reviews: Review[];
  portfolio: PortfolioItem[];
  followers: number[]; // Array of musician IDs
  following: number[]; // Array of musician IDs
}

export enum NotificationType {
  EVENT = 'Upcoming Event',
  GIG_OPPORTUNITY = 'Gig Opportunity',
  COLLABORATION_REQUEST = 'Collaboration Request',
  NEW_FOLLOWER = 'New Follower',
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  summary: string;
  details: string;
  date: string; // ISO string format
  read: boolean;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string; // ISO string
}

export interface Conversation {
  id: string; // e.g., '1-2' for a chat between user 1 and 2
  participantIds: number[];
  messages: Message[];
}

// --- New Types for Gig Board ---

export enum GigStatus {
    OPEN = 'Open',
    CLOSED = 'Closed',
    IN_PROGRESS = 'In Progress',
}

export interface Gig {
    id: number;
    title: string;
    bandName: string;
    location: string;
    description: string;
    instrumentNeeded: Instrument;
    genre: Genre;
    postedByUserId: number;
    status: GigStatus;
    postedDate: string; // ISO string
}

export interface PendingUser {
    id: string; // temp id
    email: string;
    name: string;
    hashedPassword?: string; // conceptual
    verificationToken: string;
    expiresAt: string; // ISO string
}
