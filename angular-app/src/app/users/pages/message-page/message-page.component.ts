import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../users/services/token.service';
import { MessageService } from '../../../users/services/message.service';
import { WebSocketService } from '../../../users/services/websocket.service';
import { Message } from '../../../models/messages';
import { NavbarPageComponent } from '../../../shared/pages/navbar-page/navbar-page.component';
import { LinkLoginAndCreateAccountComponent } from '../../../shared/pages/link-login-and-create-account/link-login-and-create-account.component';
import { Conversation } from '../../../chat/chat/interfaces/conversation';
import { UploadContentPageComponent } from '../../../shared/pages/uploader-page-component/uploader-page-component';

@Component({
  selector: 'app-message-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarPageComponent, LinkLoginAndCreateAccountComponent, UploadContentPageComponent,],
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.css',
})
export class MessagePageComponent implements OnInit {
  currentUsername!: string;
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private ws: WebSocketService,
    
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.tokenService.getUsernameFromToken()!;
    this.messageService.getConversations(this.currentUsername).subscribe({
      next: (data) => (this.conversations = data),
      error: (err) => console.error('Error loading conversations:', err),
    });
  }

  selectConversation(conv: Conversation): void {
    this.selectedConversation = conv;
    this.messages = [];
    this.ws.disconnect();

    this.messageService
      .getConversation(this.currentUsername, conv.otherUsername)
      .subscribe((msgs) => (this.messages = msgs));

    this.ws.connect(conv.conversationId, (msg: any) => {
      if (msg.type !== 'SEEN') {
        this.messages.push(msg);
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const message: Message = {
      senderId: this.currentUsername,
      receiverId: this.selectedConversation.otherUsername,
      body: this.newMessage,
    };

    this.ws.sendMessage(message);
    this.newMessage = '';
  }
}