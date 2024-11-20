import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-navbar-page',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    
  ],
  templateUrl: './navbar-page.component.html',
  styleUrl: './navbar-page.component.css'
})
export class NavbarPageComponent {

  constructor(
    // private authService: AuthService,
    private router: Router
  ) {}

  //TODO: HACER username en el html dinamico

}
