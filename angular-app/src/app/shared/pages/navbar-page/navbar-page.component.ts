// import { Component } from '@angular/core';
// import { MaterialModule } from '../../../material/material-module';
// import { Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { FilterPageComponent } from '../../../home/pages/filter-page/filter-page.component';
// import { AuthService } from '../../../users/services/auth.service';

// @Component({
//     selector: 'app-navbar-page',
//     imports: [MaterialModule, RouterLink, FormsModule, FilterPageComponent],
//     templateUrl: './navbar-page.component.html',
//     styleUrl: './navbar-page.component.css'
// })
// export class NavbarPageComponent {
//   constructor(private authService: AuthService, private router: Router) {}

//   get authenticated() {
//     return this.authService.authenticated();
//   }

//   get user(){
//     return null;
//     //return this.authService.user.user;
//   }

//   handlerLogout() {
//     //this.authService.logout();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPageComponent } from '../../../home/pages/filter-page/filter-page.component';
import { AuthService } from '../../../users/services/auth.service';
import { TokenService } from '../../../users/services/token.service';

@Component({
  selector: 'app-navbar-page',
  imports: [MaterialModule, FormsModule, FilterPageComponent],
  templateUrl: './navbar-page.component.html',
  styleUrl: './navbar-page.component.css',
})
export class NavbarPageComponent implements OnInit {
  message = '';
  isLogged: boolean = false;
  isUser: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe(
      (data) => {
        this.message = data;
        this.getLogged();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isUser = this.tokenService.isUser();
  }

  get user(): any {
    console.log("ACA TENGO LOS DATOS DEL USUARIO", this.message);
    return null;
  }
}
