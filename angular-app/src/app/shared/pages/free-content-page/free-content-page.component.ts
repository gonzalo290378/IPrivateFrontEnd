import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatList } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserService } from '../../../users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { UserImagePipe } from '../../../users/pipes/user-image.pipe';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../users/services/token.service';
import { UploadContentPageComponent } from '../uploader-page-component/uploader-page-component';

@Component({
  selector: 'app-free-content-page',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatProgressSpinner,
    MatCard,
    MatCardContent,
    MatList,
    CommonModule,
    FormsModule,
    UserImagePipe,
    MaterialModule,
    UploadContentPageComponent,
  ],
  templateUrl: './free-content-page.component.html',
})
export class FreeContentPageComponent {
  user?: UserDTO;
  isEditMode: boolean = false;
  isOwner: boolean = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;
    const loggedUsername = this.tokenService.getUsernameFromToken();

    this.activatedRoute.params
      .pipe(
        switchMap(({ username }) =>
          this.userService.checkAvailabilityUsername(username)
        )
      )

      .subscribe((userExits) => {
        if (!userExits) {
          return this.router.navigate(['/']);
        } else {
          //ACA TENGO QUE HACER UNA LLAMADA PARA QUE TRAIGA ENTERO EL USER
          this.user = userExits;
          this.isOwner = loggedUsername === userExits.username;
          return;
        }
      });
  }

  save(): void {
    if (!this.user) return;
    this.userService.update(this.user).subscribe({
      next: () => {
        alert('Perfil actualizado correctamente');
        this.router.navigateByUrl(`/`);
      },
      error: () => {
        alert('Error al actualizar el perfil');
      },
    });
  }

  goBack(): void {
    this.router.navigateByUrl('');
  }
}
