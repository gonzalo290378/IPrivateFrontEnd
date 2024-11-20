import { Component } from '@angular/core';
import { FilterPageComponent } from '../filter-page/filter-page.component';
import { MeetingRoomPageComponent } from '../meeting-room-page/meeting-room-page.component';
import { PublicFeedPageComponent } from '../public-feed-page/public-feed-page.component';
import { NavbarPageComponent } from '../../../shared/pages/navbar-page/navbar-page.component';
import { PostContentPageComponent } from '../../../shared/pages/post-content-page/post-content-page.component';
import { LoginPageComponent } from '../../../auth/pages/login-page/login-page.component';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-layout-home-page',
  standalone: true,
  imports:[
    FilterPageComponent,
    MeetingRoomPageComponent,
    PublicFeedPageComponent,
    NavbarPageComponent,
    PostContentPageComponent,
    LoginPageComponent,
    MaterialModule,
    
  ],
  templateUrl: './layout-home-page.component.html',
  styleUrl: './layout-home-page.component.css'
})
export class LayoutHomePageComponent {

}
