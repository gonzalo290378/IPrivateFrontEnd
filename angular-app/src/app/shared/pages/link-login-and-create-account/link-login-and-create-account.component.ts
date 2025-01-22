import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../users/services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-link-login-and-create-account',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
  
  ],
  templateUrl: './link-login-and-create-account.component.html',
})
export class LinkLoginAndCreateAccountComponent {

  constructor(private authService: AuthService) {}

  get authenticated(){
    return this.authService.authenticated();
  }


}
