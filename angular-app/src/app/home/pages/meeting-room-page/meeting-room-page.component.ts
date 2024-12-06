import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../users/services/user.service';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { UserCardPageComponent } from '../../../users/pages/user-card-page/user-card-page.component';

@Component({
  selector: 'app-meeting-room-page',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective, UserCardPageComponent],
  templateUrl: './meeting-room-page.component.html',
  styleUrl: './meeting-room-page.component.css',
})
export class MeetingRoomPageComponent implements OnInit {
  constructor(private userService: UserService) {}

  users: UserDTO[] = [];

  throttle = 0;
  distance = 0;
  page = 0;
  size = 5;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      this.size = isMobile ? 10 : 5;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.findAll(this.page, this.size).subscribe((users) => {
      this.users.push(...users.content);
    });
  }

  onScroll(): void {
    this.userService.findAll(++this.page, this.size).subscribe((users) => {
      this.users.push(...users.content);
    });
  }
}
