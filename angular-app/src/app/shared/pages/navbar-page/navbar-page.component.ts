import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../users/services/token.service';
import { ResourceService } from '../../../users/services/resource.service';
import { UserProfile } from '../../../models/user-profle';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../../users/services/message.service';
import { WebSocketService } from '../../../users/services/websocket.service';

@Component({
  selector: 'app-navbar-page',
  imports: [MaterialModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './navbar-page.component.html',
})
export class NavbarPageComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | undefined;
  isLogged: boolean = false;
  isUser: boolean = false;
  unreadCount: number = 0;

  constructor(
    private tokenService: TokenService,
    private resourceService: ResourceService,
    private messageService: MessageService,
    private ws: WebSocketService,
  ) {}

  ngOnInit(): void {
    this.getLogged();

    if (this.isLogged) {
      this.resourceService.user().subscribe({
        next: (data) => {
          this.userProfile = data.user;
          this.initUnread(this.userProfile!.username);
        },
        error: (err) => {
          console.log('Error to get User:', err);
          this.handleAuthError();
        },
      });
    }
  }

  private initUnread(username: string): void {
    this.messageService.getTotalUnread(username).subscribe({
      next: (count) => (this.unreadCount = count),
      error: (err) => console.warn('Error cargando unread:', err),
    });

    this.ws.subscribeToUnread(
      username,
      (count: number) => {
        this.unreadCount = count;
      },
      () => {
        this.messageService.triggerConversationsRefresh();
      },
    );
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isUser = this.tokenService.isUser();
  }

  private handleAuthError(): void {
    this.userProfile = undefined;
    this.isLogged = false;
    this.isUser = false;
  }

  ngOnDestroy(): void {
    this.ws.unsubscribeUnread();
  }
}
