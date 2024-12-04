import { Component, OnInit } from '@angular/core';
import { LoginPageComponent } from '../../../auth/pages/login-page/login-page.component';
import { NavbarPageComponent } from '../../../shared/pages/navbar-page/navbar-page.component';
import { PostContentPageComponent } from '../../../shared/pages/post-content-page/post-content-page.component';
import { FreeContentPageComponent } from '../../../shared/pages/free-content-page/free-content-page.component';
import { PrivateContentPageComponent } from '../private-content-page/private-content-page.component';
import { SuggestionPageComponent } from '../../../shared/pages/suggestion-page/suggestion-page.component';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { LinkLoginAndCreateAccountComponent } from '../../../shared/pages/link-login-and-create-account/link-login-and-create-account.component';
import { switchMap } from 'rxjs';
import { User } from '../../../models/user';
import { UserDTO } from '../../../dto/user-dto';
import { UserCardPageComponent } from '../user-card-page/user-card-page.component';

@Component({
  selector: 'app-layout-users-page',
  standalone: true,
  imports: [
    NavbarPageComponent,
    FreeContentPageComponent,
    SuggestionPageComponent,
    MatCard,
    LinkLoginAndCreateAccountComponent,
  ],
  templateUrl: './layout-users-page.component.html',
  styleUrl: './layout-users-page.component.css',
})
export class LayoutUsersPageComponent implements OnInit {
  public user?: UserDTO;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ username }) =>
          this.userService.getUserByUsername(username)
        )
      )
      .subscribe((user) => {
        if (!user) return this.router.navigate(['/']);
        this.user = user;
        return;
      });
  }
}
