import { Component, Input, OnInit } from '@angular/core';
import { UserDTO } from '../../../dto/user-dto';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChip, MatChipListbox } from '@angular/material/chips';
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
        MatCardHeader,
        MatGridListModule,
        MatChipListbox,
        MatChip,
        MatCardActions,
        MatButton,
        MatIcon,
        RouterLink,
        UserImagePipe,
        CommonModule,
    ],
    templateUrl: './user-card-page.component.html',
    styleUrl: './user-card-page.component.css'
})
export class UserCardPageComponent implements OnInit{

  @Input()
  user?: UserDTO;

  ngOnInit(): void {
    if(!this.user) throw Error('User is required')
  }
}
