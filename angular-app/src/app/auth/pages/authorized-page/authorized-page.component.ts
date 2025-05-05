import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../users/services/auth.service';
import { TokenService } from '../../../users/services/token.service';

@Component({
  selector: 'authorized-page',
  imports: [MaterialModule, RouterModule, FormsModule],
  templateUrl: './authorized-page.component.html',
})
export class AuthorizedComponent implements OnInit {
  // user: User;
  code = '';

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
      this.getToken();
    });
  }

  getToken(): void{
    this.authService.getToken(this.code).subscribe(
      data => {
        console.log(data);
        this.tokenService.setTokens(data.access_token, data.refresh_token);
        this.router.navigate(['/']);
      },
      error => {
        console.log(error);

      }
    );

  }

  // this.user = {
  //   username: '',
  //   age: 0,
  //   sex: '',
  //   email: '',
  //   birthdate: '',
  //   description: '',
  //   isEnabled: false,
  //   password: '',
  //   idFreeArea: undefined,
  //   idPrivateArea: undefined,
  //   preference: undefined,
  //   country: undefined,
  //   city: undefined,
  // };
  //}

  // onSubmit() {
  //   if (!this.user.email || !this.user.password) {
  //     Swal.fire(
  //       'Error de validación!',
  //       'Email y password son requeridos!',
  //       'error'
  //     );
  //   } else {
  //     const email = this.user.email;
  //     const password = this.user.password;

  //     this.authService.loginUser({ email, password }).subscribe({
  //       next: (response) => {
  //         const token = response.token;
  //         const payload = this.authService.getPayload(token);

  //         const user = { username: payload.sub };
  //         const login = {
  //           user,
  //           isAuth: true,
  //         };

  //         this.authService.token = token;
  //         this.authService.user = login;
  //         this.router.navigate(['/']);
  //       },
  //       error: (error) => {
  //         if (error.status == 401) {
  //           console.log(error.error);
  //           Swal.fire('Login error', error.error.message, 'error');
  //         } else {
  //           throw error;
  //         }
  //       },
  //     });
  //   }
  // }
}
