
export enum UserRole {
  CAREGIVER = 'CAREGIVER',
  CARESEEKER = 'CARESEEKER'
}

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  photo: string;
  location: string;
  bio: string;
  tags: string[];
  rating: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  participant: Profile;
  lastMessage: string;
  messages: Message[];
}

export type AppView = 'AUTH' | 'ROLE_SELECT' | 'PROFILE_EDIT' | 'SWIPE' | 'CHATS' | 'CHAT_DETAIL' | 'SETTINGS';
