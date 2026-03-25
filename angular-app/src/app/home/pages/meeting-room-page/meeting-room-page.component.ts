import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../users/services/user.service';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { UserCardPageComponent } from '../../../users/pages/user-card-page/user-card-page.component';

@Component({
  selector: 'app-meeting-room-page',
  imports: [CommonModule, InfiniteScrollDirective, UserCardPageComponent],
  templateUrl: './meeting-room-page.component.html',
})
export class MeetingRoomPageComponent implements OnInit {
  constructor(private userService: UserService) {}

  users: UserDTO[] = [];
  noResults = false;
  throttle = 0;
  distance = 0;
  page = 0;
  size = 5;
  filtersApplied = false;
  filters: any = {
    ageFrom: null,
    ageTo: null,
    sexPreference: null,
    country: null,
    state: null,
    city: null,
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      this.size = isMobile ? 10 : 5;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    const request$ =
      this.filtersApplied && this.filters
        ? this.userService.filterUsers(this.filters, this.page, this.size)
        : this.userService.findAll(this.page, this.size);

    request$.subscribe({
      next: (response) => {
        const content = response.content ?? response;
        if (content.length > 0) {
          this.users.push(...content);
          this.noResults = false;
        } else if (this.page === 0) {
          this.noResults = true;
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  applyFilters(newFilters: any): void {
    this.filters = { ...newFilters };
    this.filtersApplied = true;
    this.page = 0;
    this.users = [];
    this.loadUsers();
  }

  onScroll(): void {
    this.page++;
    this.loadUsers();
  }
}
