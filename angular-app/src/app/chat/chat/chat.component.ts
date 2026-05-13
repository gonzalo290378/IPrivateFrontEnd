import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../users/services/websocket.service';
import { MessageService } from '../../users/services/message.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../users/services/token.service';
import { MessageDTO } from '../../dto/messages-dto';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  messages: MessageDTO[] = [];
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
    this.otherUserId = this.route.snapshot.paramMap.get('id')!;
    this.currentUserId = this.tokenService.getUsernameFromToken()!;
    this.conversationId = this.buildConversationId(
      this.currentUserId,
      this.otherUserId,
    );

    this.messageService
      .getConversation(this.currentUserId, this.otherUserId)
      .subscribe((msgs) => {
        this.messages = msgs;
      });

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

    const message: MessageDTO = {
      senderId: this.currentUserId,
      receiverId: this.otherUserId,
      body: this.newMessage,
    };

    this.ws.sendMessage(message);
    this.newMessage = '';
  }

  buildConversationId = (user1: string, user2: string) => {
    return [user1, user2].sort().join('_');
  };
}
