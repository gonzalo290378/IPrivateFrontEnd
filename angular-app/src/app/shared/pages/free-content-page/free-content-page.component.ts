import { Component } from '@angular/core';
import {
  MatCard,
  MatCardContent
} from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatList, MatListItem } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserService } from '../../../users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { UserImagePipe } from '../../../users/pipes/user-image.pipe';
import { MaterialModule } from '../../../material/material-module';
import { PostContentPageComponent } from '../post-content-page/post-content-page.component';
import { FormsModule } from '@angular/forms';

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
    PostContentPageComponent,
  ],
  templateUrl: './free-content-page.component.html',
})
export class FreeContentPageComponent {
  user?: UserDTO;
  isEditMode: boolean = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;

    this.activatedRoute.params
      .pipe(
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
