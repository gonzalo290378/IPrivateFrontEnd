import { Component, Input, OnInit } from '@angular/core';
import { UserDTO } from '../../../dto/user-dto';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserImagePipe } from '../../pipes/user-image.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card-page',
  imports: [
    MatCardContent,
    MatCard,
    MatGridListModule,
    MatCardActions,
    MatButton,
    MatIcon,
    RouterLink,
    UserImagePipe,
    CommonModule,
  ],
  templateUrl: './user-card-page.component.html',
})
export class UserCardPageComponent implements OnInit {
  @Input()
  user?: UserDTO;

  ngOnInit(): void {
    if (!this.user) throw Error('User is required');
  }
}
