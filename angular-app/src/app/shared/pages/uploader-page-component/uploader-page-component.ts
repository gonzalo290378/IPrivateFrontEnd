import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../users/services/token.service';
import { ResourceService } from '../../../users/services/resource.service';
import { FreeAreaService } from '../../../users/services/free-area.service';
import { PrincipalPhotoDTO } from '../../../dto/principal-photo-dto';
import { UserService } from '../../../users/services/user.service';
import { FreeAreaDTO } from '../../../dto/free-area-dto';

@Component({
  selector: 'app-upload-content-page',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './uploader-page-component.html',
})
export class UploadContentPageComponent implements OnInit {
  uploadedImages: string[] = [];
  textComment: string = '';
  isDragOver = false;
  isLogged: boolean = false;
  isUser: boolean = false;
  message = '';
  username: string | null = null;
  principalPhotoDTO!: PrincipalPhotoDTO;
  uploadedFiles: File[] = [];
  freeArea!: FreeAreaDTO;
  isUploading: boolean = false;


  constructor(
    private tokenService: TokenService,
    private resourceService: ResourceService,
    private freeAreaService: FreeAreaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.tokenService.getUsernameFromToken();
    this.username = username;

    this.resourceService.user().subscribe({
      next: (data) => {
        this.message = data;
        this.getLogged();
        console.log('User from Uploader', username);
      },
      error: (err) => {
        console.error('Error en resourceService.user()', err);
      },
    });

    if (username) {
      this.userService.getEntityByUsername(username).subscribe({
        next: (user) => {
          if (!user) {
            console.error('Usuario no encontrado');
            return;
          }

          if (!user.freeAreaDTO) {
            console.error('El usuario no tiene freeArea asociada');
            return;
          }

          this.freeArea = user.freeAreaDTO;
          console.log('FreeArea ID encontrado:', this.freeArea.id);
        },
        error: (err) => {
          console.error('Error obteniendo usuario desde userService:', err);
        },
      });
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        this.uploadedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.uploadedImages.push(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      Array.from(event.dataTransfer.files).forEach((file) => {
        this.uploadedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.uploadedImages.push(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

submit(): void {
  if (
    !this.username ||
    this.uploadedImages.length === 0 ||
    !this.freeArea?.id ||
    !this.textComment.trim()
  ) {
    return;
  }

  this.isUploading = true;

  const formData = new FormData();
  this.uploadedFiles.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('description', this.textComment);

  this.freeAreaService.uploadPublicContent(formData, this.freeArea.id).subscribe({
    next: (res) => {
      console.log('Contenido subido correctamente', res);
      this.freeAreaService.refreshFeed$.next();
      this.uploadedFiles = [];
      this.uploadedImages = [];
      this.textComment = '';
      this.isUploading = false;
    },
    error: (err) => {
      console.error('Error al subir contenido', err);
      this.isUploading = false;
    },
  });
}


  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isUser = this.tokenService.isUser();
  }
}
