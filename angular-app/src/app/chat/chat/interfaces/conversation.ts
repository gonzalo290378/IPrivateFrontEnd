export interface Conversation {
  otherUsername: string;
  otherUserId?: number;
  lastMessage: string;
  lastMessageDate: string;
  conversationId: string;
  profilePhotoUrl?: string;
  unreadCount?: number;
}
