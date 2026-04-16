import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../material/material-module';
import { FollowService } from '../../services/follow.service';
import { FollowResponseDTO } from '../models/follow.model';
import { MatListModule } from '@angular/material/list';
import { TokenService } from '../../../../users/services/token.service';
import { environment } from '../../../../../environments/environment';

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
  private baseUrl = environment.msFreeArea;

  constructor(
    private followService: FollowService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
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
