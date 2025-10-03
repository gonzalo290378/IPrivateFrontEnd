import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatList } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserService } from '../../../users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../users/services/token.service';
import { UploadContentPageComponent } from '../uploader-page-component/uploader-page-component';
import { ProfileFeedContentPage } from '../../../users/pages/profile-feed-page/profile-feed-content-page.component';
import { FreeAreaService } from '../../../users/services/free-area.service';

@Component({
  selector: 'app-free-content-page',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatProgressSpinner,
    MatCard,
    MatCardContent,
    CommonModule,
    FormsModule,
    MaterialModule,
    UploadContentPageComponent,
    ProfileFeedContentPage,
  ],
  templateUrl: './free-content-page.component.html',
})
export class FreeContentPageComponent {
  user?: UserDTO;
  isEditMode: boolean = false;
  isOwner: boolean = false;
  profileImageUrl: string = '/assets/default-avatar.png';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private baseUrl = `http://localhost:8090/ms-free-area`;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private freeAreaService: FreeAreaService
  ) {}

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;
    this.activatedRoute.params
      .pipe(
        switchMap(({ username }) =>
          this.userService.getEntityByUsername(username)
        )
      )

      .subscribe((user) => {
        if (!user) return this.router.navigate(['/']);
        this.user = user;
        const loggedUsername = this.tokenService.getUsernameFromToken();
        this.isOwner = loggedUsername === user.username;
        this.updateProfileImageUrl();
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

  openImageEditor(): void {
    if (!this.isOwner || !this.isEditMode) {
      return;
    }
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        alert('La imagen debe ser menor a 15MB');
        return;
      }

      this.processSelectedImage(file);
    }

    target.value = '';
  }

  private processSelectedImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64String = e.target?.result as string;

      this.uploadUserImage(file, base64String);
    };

    reader.readAsDataURL(file);
  }

  private uploadUserImage(file: File, base64String: string): void {
    if (!this.user?.freeAreaDTO?.id) {
      alert('No se encontró la información del área libre del usuario');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('idFreeArea', this.user.freeAreaDTO.id.toString());

    this.freeAreaService.uploadPrincipalPhoto(formData).subscribe({
      next: (response) => {
        if (response && this.user?.freeAreaDTO?.principalPhotoDTO) {
          this.user.freeAreaDTO = {
            ...this.user.freeAreaDTO,
            principalPhotoDTO: [response],
          };

          console.log('ver', response);
          console.log('Imagen actualizada correctamente');

          this.updateProfileImageUrl();
        } else {
          console.error('Error al procesar la respuesta del servidor');
        }
      },
      error: (error) => {
        console.error('Error al subir la imagen:', error);
      },
    });
  }

  canEditImage(): boolean {
    return this.isOwner && this.isEditMode;
  }

  getProfileImageUrl(): string {
    if (!this.user?.freeAreaDTO?.principalPhotoDTO?.[0]?.url) {
      return `${this.baseUrl}/uploads/users/no-image.jpg`;
    }

    const relativePath = this.user.freeAreaDTO.principalPhotoDTO[0].url;
    return `${this.baseUrl}${relativePath}`;
  }

  private updateProfileImageUrl(): void {
    if (!this.user?.freeAreaDTO?.principalPhotoDTO?.[0]?.url) {
      this.profileImageUrl = `${this.baseUrl}/uploads/users/no-image.jpg`;
      return;
    }

    const relativePath = this.user.freeAreaDTO.principalPhotoDTO[0].url;
    this.profileImageUrl = `${this.baseUrl}${relativePath}`;
  }
}
