import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';

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

}
