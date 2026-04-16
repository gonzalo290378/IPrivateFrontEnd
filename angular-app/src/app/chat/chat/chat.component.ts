import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/messages';
import { WebSocketService } from '../../users/services/websocket.service';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  conversationId!: string;

  ngOnInit() {
    this.conversationId = 'userA_userB';
    this.ws.connect(this.conversationId, (msg: Message) => {
      this.messages.push(msg);
    });
  }

  constructor(private ws: WebSocketService) {}
}
