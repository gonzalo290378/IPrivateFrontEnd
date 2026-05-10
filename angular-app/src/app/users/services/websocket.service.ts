import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Message } from '../../models/messages';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client!: Client;
  private globalClient!: Client;
  private unreadSubscription?: StompSubscription;

  connect(
    conversationId: string,
    callback: (msg: any) => void,
    onConnected?: () => void,
  ): void {
    const wsUrl =
      environment.baseUrl.replace('http', 'ws') + '/ms-messages/ws-chat';

    this.client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP DEBUG]', str),
      onConnect: () => {
        console.log('✅ Conectado!');
        this.client.subscribe(
          `/topic/conversations/${conversationId}`,
          (msg: IMessage) => {
            callback(JSON.parse(msg.body));
          },
        );
        onConnected?.();
      },
      onWebSocketError: (error) => console.error('🔴 WS Error:', error),
      onStompError: (frame) => console.error('🔴 STOMP Error:', frame),
    });

    this.client.activate();
  }

  sendMessage(message: Message): void {
    if (!this.client?.connected) return;
    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }

  markAsSeen(dto: any): void {
    if (!this.client?.connected) return;
    this.client.publish({
      destination: '/app/chat.seen',
      body: JSON.stringify(dto),
    });
  }

  disconnect(): void {
    if (this.client?.active) {
      this.client.deactivate();
    }
  }

  subscribeToUnread(username: string, callback: (count: number) => void): void {
    const wsUrl =
      environment.baseUrl.replace('http', 'ws') + '/ms-messages/ws-chat';

    this.globalClient = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        this.unreadSubscription = this.globalClient.subscribe(
          `/topic/unread/${username}`,
          (msg: IMessage) => {
            callback(Number(JSON.parse(msg.body)));
          },
        );
      },
    });

    this.globalClient.activate();
  }

  unsubscribeUnread(): void {
    this.unreadSubscription?.unsubscribe();
    if (this.globalClient?.active) {
      this.globalClient.deactivate();
    }
  }
}
