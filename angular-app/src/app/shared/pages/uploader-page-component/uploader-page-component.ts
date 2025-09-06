import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../users/services/token.service';
import { ResourceService } from '../../../users/services/resource.service';
import { FreeAreaService } from '../../../users/services/free-area.service';
import { PrincipalPhotoDTO } from '../../../dto/principal-photo-dto';

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

  constructor(
    private tokenService: TokenService,
    private resourceService: ResourceService,
    private freeAreaService: FreeAreaService
  ) {}

  ngOnInit(): void {
    const username = this.tokenService.getUsernameFromToken();
    this.username = username;
    this.resourceService.user().subscribe(
      (data) => {
        this.message = data;
        this.getLogged();
        console.log('User from Uploader', username);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
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
    if (!this.username || this.uploadedImages.length === 0) return;

    const mainImage = this.uploadedImages[0];

    const formData = new FormData();
    formData.append('file', mainImage);

    formData.append('description', this.textComment || '');
    formData.append('isEnabled', 'true');
    const today = new Date().toISOString().split('T')[0];
    formData.append('createdAt', today);
    formData.append('updatedAt', today);

    this.freeAreaService.uploadContent(formData).subscribe({
      next: (res) => {
        console.log('Contenido subido correctamente', res);
        this.uploadedImages = [];
        this.textComment = '';
      },
      error: (err) => {
        console.error('Error al subir contenido', err);
      },
    });
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isUser = this.tokenService.isUser();
  }
}
