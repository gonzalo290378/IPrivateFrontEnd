import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-content-page',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './post-content-page.component.html',
  styleUrl: './post-content-page.component.css'
})
export class PostContentPageComponent {
  uploadedImages: string[] = [];
  textComment: string = ''; // Variable para el comentario
  isDragOver = false;

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
    // Procesar las imágenes y el comentario
    console.log('Imágenes subidas:', this.uploadedImages);
    console.log('Comentario:', this.textComment);

    // Lógica para enviar los datos al servidor
  }

}
