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
    this.resourceService.user().subscribe(
      (data) => {
        console.log('DATA DEL USUARIO:', data);
        this.user = data;
        this.getLogged();
      },
      (err) => {
        console.log('Error al obtener el usuario:', err);
      }
    );
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isUser = this.tokenService.isUser();
  }
}
