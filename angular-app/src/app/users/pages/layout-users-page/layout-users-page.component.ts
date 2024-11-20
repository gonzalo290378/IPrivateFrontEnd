import { Component } from '@angular/core';
import { LoginPageComponent } from '../../../auth/pages/login-page/login-page.component';
import { NavbarPageComponent } from '../../../shared/pages/navbar-page/navbar-page.component';
import { PostContentPageComponent } from '../../../shared/pages/post-content-page/post-content-page.component';
import { EditProfilePageComponent } from '../edit-profile-page/edit-profile-page.component';
import { FreeContentPageComponent } from '../../../shared/pages/free-content-page/free-content-page.component';
import { PrivateContentPageComponent } from '../private-content-page/private-content-page.component';
import { SuggestionPageComponent } from '../../../shared/pages/suggestion-page/suggestion-page.component';

@Component({
  selector: 'app-layout-users-page',
  standalone: true,
  imports: [
    LoginPageComponent,
    NavbarPageComponent,
    PostContentPageComponent,
    FreeContentPageComponent,
    PrivateContentPageComponent,
    SuggestionPageComponent,

    EditProfilePageComponent,
  ],
  templateUrl: './layout-users-page.component.html',
  styleUrl: './layout-users-page.component.css'
})
export class LayoutUsersPageComponent {

}
