import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../material/material-module';
import { FollowService } from '../../services/follow.service';
import { FollowResponseDTO } from '../models/follow.model';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-followers-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatListModule],
  templateUrl: './followers-list.component.html',
  styleUrl: './followers-list.component.css',
})
export class FollowersListComponent implements OnInit {
  followers: FollowResponseDTO[] = [];
  isLoading = true;
  username = '';
  private baseUrl = 'http://localhost:8090/ms-free-area';

  constructor(
    private followService: FollowService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['username'];
    const userId = +this.activatedRoute.snapshot.params['id'];
    this.loadFollowers(userId);
  }

  loadFollowers(userId: number): void {
    this.followService.getFollowers(userId).subscribe({
      next: (data) => {
        this.followers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading followers', err);
        this.isLoading = false;
      },
    });
  }

  getPhotoUrl(photoUrl?: string): string {
    if (!photoUrl) return `${this.baseUrl}/uploads/users/no-image.jpg`;
    return `${this.baseUrl}${photoUrl}`;
  }

  goToProfile(username: string, id: number): void {
    this.router.navigate([username, id]);
  }

  goBack(): void {
    this.router.navigate([
      this.username,
      this.activatedRoute.snapshot.params['id'],
    ]);
  }
}
