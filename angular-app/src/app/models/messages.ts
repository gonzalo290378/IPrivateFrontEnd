export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  conversationId?: string;
  body: string;
  createdAt?: string;
  status?: 'SENT' | 'SEEN';
}
