import { Component } from '@angular/core';
import { MeetingRoomPageComponent } from '../meeting-room-page/meeting-room-page.component';
import { NavbarPageComponent } from '../../../shared/pages/navbar-page/navbar-page.component';
import { MaterialModule } from '../../../material/material-module';
import { LinkLoginAndCreateAccountComponent } from '../../../shared/pages/link-login-and-create-account/link-login-and-create-account.component';
import { TokenService } from '../../../users/services/token.service';
import { CommonModule } from '@angular/common';
import { UploadContentPageComponent } from '../../../shared/pages/uploader-page-component/uploader-page-component';

@Component({
  selector: 'app-layout-home-page',
  imports: [
    MeetingRoomPageComponent,
    NavbarPageComponent,
    MaterialModule,
    LinkLoginAndCreateAccountComponent,
    UploadContentPageComponent,
    CommonModule,
  ],
  templateUrl: './layout-home-page.component.html',
})
export class LayoutHomePageComponent {
  isOwner: boolean = false;

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    const username = this.tokenService.getUsernameFromToken();
    this.isOwner = !!username;
  }
}
