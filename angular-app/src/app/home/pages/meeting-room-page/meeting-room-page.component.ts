import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-meeting-room-page',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,

  ],
  templateUrl: './meeting-room-page.component.html',
  styleUrl: './meeting-room-page.component.css',
})

export class MeetingRoomPageComponent implements OnInit {

  constructor(
    private userService: UserService,
  ) {}
    
  users: UserDTO[] = [];

  throttle = 0;
  distance = 2;
  page = 0;
  size = 5;

  ngOnInit(): void {
    this.userService
      .findAll(this.page, this.size)
      .subscribe((users => {
        this.users = users.content;
      }));
  }
  onScroll(): void {
    this.userService
      .findAll(++this.page, this.size)
      .subscribe((users => {
        this.users.push(...users.content);
      }));
  }

}
