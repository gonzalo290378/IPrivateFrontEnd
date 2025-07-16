import { Component, OnInit } from '@angular/core';
import { NavbarPageComponent } from '../../../shared/pages/navbar-page/navbar-page.component';
import { FreeContentPageComponent } from '../../../shared/pages/free-content-page/free-content-page.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkLoginAndCreateAccountComponent } from '../../../shared/pages/link-login-and-create-account/link-login-and-create-account.component';
import { switchMap } from 'rxjs';
import { UserDTO } from '../../../dto/user-dto';

@Component({
  selector: 'app-layout-users-page',
  imports: [
    NavbarPageComponent,
    FreeContentPageComponent,
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
