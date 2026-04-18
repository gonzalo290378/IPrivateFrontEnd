import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/messages';
import { WebSocketService } from '../../users/services/websocket.service';
import { MessageService } from '../../users/services/message.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  conversationId!: string;
  newMessage: string = '';
  currentUserId = 'userA';
  otherUserId = 'userB';

  constructor(
    private ws: WebSocketService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const otherUserId = this.route.snapshot.paramMap.get('id')!;

    const currentUserId = 'userA'; // ⚠️ luego lo sacamos de auth

    this.conversationId = this.buildConversationId(currentUserId, otherUserId);

    // 🟢 historial
    this.messageService
      .getConversation(currentUserId, otherUserId)
      .subscribe((msgs) => {
        this.messages = msgs;
      });

    // 🟢 realtime
    this.ws.connect(this.conversationId, (msg: any) => {
      if (msg.type === 'SEEN') {
        console.log('seen update');
      } else {
        this.messages.push(msg);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      senderId: this.currentUserId,
      receiverId: this.otherUserId,
      body: this.newMessage,
    };

    this.ws.sendMessage(message);

    this.newMessage = '';
  }

  buildConversationId(id1: string, id2: string): string {
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
  }
}
