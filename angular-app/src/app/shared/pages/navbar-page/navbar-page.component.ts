import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPageComponent } from '../../../home/pages/filter-page/filter-page.component';
import { TokenService } from '../../../users/services/token.service';
import { ResourceService } from '../../../users/services/resource.service';
import { UserProfile } from '../../../models/user-profle';

@Component({
  selector: 'app-navbar-page',
  imports: [MaterialModule, FormsModule, FilterPageComponent, RouterLink],
  templateUrl: './navbar-page.component.html',
})
export class NavbarPageComponent implements OnInit {
  userProfile: UserProfile | undefined;
  isLogged: boolean = false;
  isUser: boolean = false;

  constructor(
    private tokenService: TokenService,
    private resourceService: ResourceService
  ) {}

  ngOnInit(): void {
    this.getLogged();

    if (this.isLogged) {
      this.resourceService.user().subscribe({
        next: (data) => {
          this.userProfile = data.user;
          console.log('User from Navbar:', this.userProfile);
        },
        error: (err) => {
          console.log('Error to get User:', err);
          this.handleAuthError();
        },
      });
    } else {
      console.log('Usuario not authenticated');
    }
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
}
