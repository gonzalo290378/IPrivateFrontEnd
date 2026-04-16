import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserDTO } from '../../../../dto/user-dto';
import { UserService } from '../../../services/user.service';
import { NavbarPageComponent } from '../../../../shared/pages/navbar-page/navbar-page.component';
import { FreeContentPageComponent } from '../../../../shared/pages/free-content-page/free-content-page.component';
import { LinkLoginAndCreateAccountComponent } from '../../../../shared/pages/link-login-and-create-account/link-login-and-create-account.component';

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
          this.userService.checkAvailabilityUsername(username)
        )
      )
      .subscribe((user) => {
        console.log("User from Layout-users", user);
        if (!user) return this.router.navigate(['/']);
        return;
      });
  }
}
