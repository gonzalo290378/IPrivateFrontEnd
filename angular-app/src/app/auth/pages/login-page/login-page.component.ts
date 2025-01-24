import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../../models/user';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../users/services/auth.service';

@Component({
    selector: 'app-login-page',
    imports: [MaterialModule, RouterModule, FormsModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  user: User;

  constructor(private authService: AuthService, private router: Router) {
    this.user = {
      username: '',
      age: 0,
      sex: '',
      email: '',
      birthdate: '',
      description: '',
      isEnabled: false,
      password: '',
      idFreeArea: undefined,
      idPrivateArea: undefined,
      preference: undefined,
      country: undefined,
      city: undefined,
    };
  }

  onSubmit() {
    if (!this.user.username || !this.user.password) {
      Swal.fire(
        'Error de validación!',
        'Nombre de usuario y password son requeridos!',
        'error'
      );
    } else {
      const username = this.user.username;
      const password = this.user.password;

      this.authService.loginUser({ username, password }).subscribe({
        next: (response) => {
          const token = response.token;
          console.log(token);
          const payload = this.authService.getPayload(token);

          const user = { username: payload.sub };
          const login = {
            user,
            isAuth: true,
          };
          
          this.authService.token = token;
          this.authService.user = login;
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.status == 401) {
            console.log(error.error);
            Swal.fire('Login error', error.error.message, 'error');
          } else {
            throw error;
          }
        },
      });
    }
  }
}
