import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/messages';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = `${environment.msMessages}messages`;

  constructor(private http: HttpClient) {}

  getConversation(senderId: string, receiverId: string) {
    return this.http.get<Message[]>(`${this.api}/${senderId}/${receiverId}`);
  }

  getConversationId(user1: string, user2: string) {
    return this.http.get<string>(
      `${this.api}/conversation-id?user1=${user1}&user2=${user2}`,
    );
  }
}
