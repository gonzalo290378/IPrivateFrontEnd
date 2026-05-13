import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Conversation } from '../../chat/chat/interfaces/conversation';
import { Observable, Subject } from 'rxjs';
import { MessageDTO } from '../../dto/messages-dto';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = `${environment.msMessages}messages`;
  private conversationsRefresh$ = new Subject<void>();
  readonly onConversationsRefresh$ = this.conversationsRefresh$.asObservable();

  constructor(private http: HttpClient) {}

  getConversation(senderId: string, receiverId: string) {
    return this.http.get<MessageDTO[]>(`${this.api}/${senderId}/${receiverId}`);
  }

  getConversationId(user1: string, user2: string) {
    return this.http.get<string>(
      `${this.api}/conversation-id?user1=${user1}&user2=${user2}`,
    );
  }

  getConversations(username: string) {
    return this.http.get<Conversation[]>(
      `${this.api}/conversations/${username}`,
    );
  }

  getTotalUnread(username: string): Observable<number> {
    return this.http.get<number>(`${this.api}/unread/${username}`);
  }

  triggerConversationsRefresh(): void {
    this.conversationsRefresh$.next();
  }
}
