import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/messages';
import { WebSocketService } from '../../users/services/websocket.service';
import { MessageService } from '../../users/services/message.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../users/services/token.service';

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
  currentUserId!: string;
  otherUserId!: string;

  constructor(
    private ws: WebSocketService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    // 1️⃣ usuario con el que hablas (de la URL)
    this.otherUserId = this.route.snapshot.paramMap.get('id')!;

    // 2️⃣ usuario logueado
    this.currentUserId = this.tokenService.getUsernameFromToken()!;

    // 3️⃣ 🔥 ACÁ VA LO TUYO
    this.conversationId = this.buildConversationId(
      this.currentUserId,
      this.otherUserId,
    );

    // 4️⃣ historial
    this.messageService
      .getConversation(this.currentUserId, this.otherUserId)
      .subscribe((msgs) => {
        this.messages = msgs;
      });

    // 5️⃣ realtime
    this.ws.connect(this.conversationId, (msg: any) => {
      if (msg.type === 'SEEN') {
        console.log('seen update');
      } else {
        this.messages.push(msg);
      }
    });
    console.log('TOKEN COMPLETO:', this.tokenService.getAccessToken());
    console.log('USER DEL TOKEN:', this.tokenService.getUsernameFromToken());
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      senderId: this.currentUserId,
      receiverId: this.otherUserId,
      body: this.newMessage,
    };

    this.ws.sendMessage(message);

    this.messages.push(message);

    this.newMessage = '';
  }

  buildConversationId = (user1: string, user2: string) => {
    return [user1, user2].sort().join('_');
  };
}
