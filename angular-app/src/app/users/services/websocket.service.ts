import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Message } from '../../models/messages';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client!: Client;

  connect(conversationId: string, callback: (msg: any) => void): void {
    const wsUrl =
      environment.baseUrl.replace('http', 'ws') +
      '/ms-messages/ws-chat/websocket';

    this.client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        this.client.subscribe(
          `/topic/conversations/${conversationId}`,
          (msg: IMessage) => {
            callback(JSON.parse(msg.body));
          },
        );
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
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
}
