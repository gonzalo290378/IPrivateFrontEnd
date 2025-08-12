import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPageComponent } from '../../../home/pages/filter-page/filter-page.component';
import { TokenService } from '../../../users/services/token.service';
import { ResourceService } from '../../../users/services/resource.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-navbar-page',
  imports: [MaterialModule, FormsModule, FilterPageComponent, RouterLink],
  templateUrl: './navbar-page.component.html',
})
export class NavbarPageComponent implements OnInit {
  user: User | undefined;
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
          this.user = data.user;
          console.log('User:', this.user);
        },
        error: (err) => {
          console.log('Error al obtener el usuario:', err);
          this.handleAuthError();
        },
      });
    } else {
      console.log(
        'Usuario no autenticado - no se carga información del usuario'
      );
    }
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isUser = this.tokenService.isUser();
  }

  private handleAuthError(): void {
    this.user = undefined;
    this.isLogged = false;
    this.isUser = false;
  }
}
