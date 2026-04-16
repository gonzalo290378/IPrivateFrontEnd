import { Injectable } from '@angular/core';
import { Message } from '../../models/messages';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: any;

  connect(conversationId: string, callback: (msg: any) => void) {
    const socket = new SockJS('/ws-chat');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(
        `/topic/conversations/${conversationId}`,
        (msg: any) => {
          callback(JSON.parse(msg.body));
        },
      );
    });
  }

  sendMessage(message: Message) {
    this.stompClient.send('/app/chat.send', {}, JSON.stringify(message));
  }

  markAsSeen(dto: any) {
    this.stompClient.send('/app/chat.seen', {}, JSON.stringify(dto));
  }
}
