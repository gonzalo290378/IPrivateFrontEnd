import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserService } from '../../../users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserDTO } from '../../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TokenService } from '../../../users/services/token.service';
import { UploadContentPageComponent } from '../uploader-page-component/uploader-page-component';
import { ProfileFeedContentPage } from '../../../users/pages/profile-feed-page/profile-feed-content-page.component';
import { FreeAreaService } from '../../../users/services/free-area.service';
import { UserDetailsFreeAreaDTO } from '../../../dto/user-details-free-area-dto';

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
  userForm!: FormGroup;
  isLoading: boolean = false;
  showPauseConfirmation: boolean = false;
  isConfirmPauseVisible: boolean = false;
  

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private freeAreaService: FreeAreaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;
    this.userForm = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      birthdate: [
        '',
        [
          Validators.required,
          this.ageRangeValidator,
          this.validYearLengthValidator,
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(400),
        ],
      ],
    });

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
        console.log('Fecha que llega del backend:', user.birthdate);

        this.userForm.patchValue({
          country: user.countryDTO?.country || '',
          state: user.stateDTO?.state || '',
          city: user.cityDTO?.city || '',
          description: user.description || '',
          birthdate: user.birthdate
            ? this.formatDateForInput(user.birthdate)
            : '',
        });
        this.updateProfileImageUrl();
        return;
      });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;
  }

  ageRangeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const birthdate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age < 18 || age > 90 ? { ageRange: true } : null;
  }

  validYearLengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const date = new Date(control.value);
    const year = date.getFullYear().toString();
    return year.length !== 4 ? { invalidYearLength: true } : null;
  }

  save(): void {
    if (!this.user || this.userForm.invalid) return;

    this.isLoading = true;

    const formValues = this.userForm.value;

    const userDetailsFreeAreaDTO: UserDetailsFreeAreaDTO = {
      birthdate: formValues.birthdate,
      sex: this.user.sex,
      description: formValues.description,
      country: formValues.country,
      state: formValues.state,
      city: formValues.city,
    };

    this.userService
      .updateDetailsFreeArea(this.user.username, userDetailsFreeAreaDTO)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/edit', this.user?.username]);
        },
        error: (err) => {
          console.error('Error al actualizar el perfil:', err);
          this.isLoading = false;
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

  onActivatePrivateArea(): void {
    if (!this.isOwner) return;
    alert('Función en desarrollo: activar área privada.');
  }

  getSexLabel(sex?: string): string {
    switch (sex) {
      case 'F':
        return 'Mujer';
      case 'M':
        return 'Hombre';
      case 'T':
        return 'Transgénero';
      case 'N':
        return 'No binario';
      default:
        return 'No especificado';
    }
  }

  reactivateAccount(): void {
    if (!this.user || this.user.id === undefined) {
      console.error('No hay usuario o ID definido para activar.');
      return;
    }

    this.isLoading = true;

    this.userService.reactivateUser(this.user.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.user!.isEnabled = true;
        this.isConfirmPauseVisible = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  onToggleAccountStatus(): void {
    if (!this.user) return;

    if (this.user.isEnabled) {
      this.isConfirmPauseVisible = true;
    } else {
      this.reactivateAccount();
    }
  }

  togglePauseConfirmation(): void {
    this.showPauseConfirmation = !this.showPauseConfirmation;
  }

  confirmPauseAccount(): void {
    if (!this.user || this.user.id === undefined) {
      console.error('No hay usuario o ID definido para pausar.');
      return;
    }

    const id: number = this.user.id;
    this.isLoading = true;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.isConfirmPauseVisible = false;
        this.router.navigate(['/edit', id]);
      },
      error: (err) => {
        console.error('Error al eliminar el perfil:', err);
        this.isLoading = false;
        this.isConfirmPauseVisible = true;
      },
    });
  }

  cancelPauseAccount(): void {
    this.isConfirmPauseVisible = false;
  }
  
}
