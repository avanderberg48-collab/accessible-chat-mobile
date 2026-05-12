export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  statusMessage: string | null;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  sender: User;
  content: string;
  replyToId: number | null;
  replyTo: Message | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  voiceNoteUrl: string | null;
  voiceNoteTranscription: string | null;
  voiceNoteDuration: number | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: number;
  type: 'direct' | 'group';
  name: string | null;
  participantIds: number[];
  participants: User[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceCall {
  id: number;
  callerId: number;
  caller: User;
  recipientId: number;
  recipient: User;
  status: 'pending' | 'active' | 'completed' | 'missed';
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null;
  createdAt: Date;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  screenReaderVerbosity: 'minimal' | 'normal' | 'verbose';
  announceTyping: boolean;
  audioNotifications: boolean;
  notificationVolume: number;
}
