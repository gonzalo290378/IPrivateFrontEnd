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

@Component({
    selector: 'app-navbar-page',
    imports: [MaterialModule, FormsModule, FilterPageComponent],
    templateUrl: './navbar-page.component.html',
    styleUrl: './navbar-page.component.css'
})
export class NavbarPageComponent implements OnInit {

  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user().subscribe( data => {
      //debugger;
      this.message = data.message;
    },
    err => {
      console.log(err);
    });
  }

}
