import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../material/material-module';
import { FollowService } from '../../services/follow.service';
import { FollowResponseDTO } from '../models/follow.model';
import { MatListModule } from '@angular/material/list';
import { TokenService } from '../../../../users/services/token.service';

@Component({
  selector: 'app-following-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatListModule],
  templateUrl: './following-list.component.html',
  styleUrl: './following-list.component.css',
})
export class FollowingListComponent implements OnInit {
  following: FollowResponseDTO[] = [];
  isLoading = true;
  username = '';
  private baseUrl = 'http://localhost:8090/ms-free-area';

  constructor(
    private followService: FollowService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['username'];
    const userId = +this.activatedRoute.snapshot.params['id'];
    this.loadFollowing(userId);
  }

  loadFollowing(userId: number): void {
    this.followService.getFollowing(userId).subscribe({
      next: (data) => {
        this.following = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading following', err);
        this.isLoading = false;
      },
    });
  }

  getPhotoUrl(photoUrl?: string): string {
    if (!photoUrl) return `${this.baseUrl}/uploads/users/no-image.jpg`;
    return `${this.baseUrl}${photoUrl}`;
  }

  goToProfile(username: string, id: number): void {
    if (!this.tokenService.isLogged()) return;
    this.router.navigate([username, id]);
  }

  goBack(): void {
    this.router.navigate([
      this.username,
      this.activatedRoute.snapshot.params['id'],
    ]);
  }
}
