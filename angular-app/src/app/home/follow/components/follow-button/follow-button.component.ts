import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material-module';
import { FollowService } from '../../services/follow.service';
import { TokenService } from '../../../../users/services/token.service';

@Component({
  selector: 'app-follow-button',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './follow-button.component.html',
  styleUrl: './follow-button.component.css',
})
export class FollowButtonComponent implements OnInit {
  @Input() userId!: number;
  @Output() followChanged = new EventEmitter<boolean>();

  isFollowing = false;
  isLoading = false;
  isLogged = false;

  constructor(
    private followService: FollowService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged();
    if (!this.isLogged) return;

    this.checkIfFollowing();
  }

  checkIfFollowing(): void {
    this.followService.isFollowing(this.userId).subscribe({
      next: (res) => {
        this.isFollowing = res.following;
      },
      error: (err) => {
        console.error('Error checking follow status', err);
      },
    });
  }

  toggleFollow(): void {
    if (!this.isLogged || this.isLoading) return;

    this.isLoading = true;

    if (this.isFollowing) {
      this.followService.unfollow(this.userId).subscribe({
        next: () => {
          this.isFollowing = false;
          this.isLoading = false;
          this.followChanged.emit(false);
        },
        error: (err) => {
          console.error('Error unfollowing', err);
          this.isLoading = false;
        },
      });
    } else {
      this.followService.follow(this.userId).subscribe({
        next: () => {
          this.isFollowing = true;
          this.isLoading = false;
          this.followChanged.emit(true);
        },
        error: (err) => {
          console.error('Error following', err);
          this.isLoading = false;
        },
      });
    }
  }
}
