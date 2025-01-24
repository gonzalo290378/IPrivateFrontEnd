import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatList, MatListItem } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserService } from '../../../users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { UserImagePipe } from "../../../users/pipes/user-image.pipe";
import { MaterialModule } from '../../../material/material-module';

@Component({
    selector: 'app-free-content-page',
    imports: [
        MatGridList,
        MatGridTile,
        MatProgressSpinner,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatList,
        MatListItem,
        CommonModule,
        UserImagePipe,
        MaterialModule,
    ],
    templateUrl: './free-content-page.component.html'
})
export class FreeContentPageComponent {

  public user?: UserDTO;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        //delay(200),
        switchMap(({ username }) =>
          this.userService.getUserByUsername(username)
        )
      )
      .subscribe((user) => {
        if (!user) return this.router.navigate(['/']);
        this.user = user;
        return;
      });
  }

  goBack():void {
    this.router.navigateByUrl('')
  }

}
