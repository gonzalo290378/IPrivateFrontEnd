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
import { ByCountryPageComponent } from '../../../countries/pages/by-country-page/by-country-page.component';
import { ByStatePageComponent } from '../../../countries/pages/by-state-page/by-state-page.component';
import { ByCityPageComponent } from '../../../countries/pages/by-city-page/by-city-page.component';
import { CityService } from '../../../countries/services/city.service';
import { FollowService } from '../../../home/follow/services/follow.service';
import { FollowButtonComponent } from '../../../home/follow/components/follow-button/follow-button.component';
import { environment } from '../../../../environments/environment';

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
    ByCountryPageComponent,
    ByStatePageComponent,
    ByCityPageComponent,
    FollowButtonComponent,
  ],
  templateUrl: './free-content-page.component.html',
})
export class FreeContentPageComponent {
  user?: UserDTO;
  isEditMode: boolean = false;
  isOwner: boolean = false;
  profileImageUrl: string = '/assets/default-avatar.png';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private baseUrl = environment.msFreeArea;
  userForm!: FormGroup;
  isLoading: boolean = false;
  showPauseConfirmation: boolean = false;
  isConfirmPauseVisible: boolean = false;
  followersCount: number = 0;
  followingCount: number = 0;
  isAccountEnabled: boolean = true;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private freeAreaService: FreeAreaService,
    private fb: FormBuilder,
    private cityService: CityService,
    private followService: FollowService,
  ) {}

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;
    this.userForm = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      sex: ['', Validators.required],
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
          this.userService.getEntityByUsername(username),
        ),
      )
      .subscribe((user) => {
        if (!user) return this.router.navigate(['/']);
        this.user = user;

        const loggedUsername = this.tokenService.getUsernameFromToken();
        this.isOwner = loggedUsername === user.username;

        this.userForm.patchValue({
          country: user.countryDTO?.country || '',
          state: user.stateDTO?.state || '',
          city: user.cityDTO?.city || '',
          sex: user.sex || '',
          description: user.description || '',
          birthdate: user.birthdate
            ? this.formatDateForInput(user.birthdate)
            : '',
        });

        if (user.countryDTO?.country) {
          this.cityService.setSelectedCountry(user.countryDTO.country);
        }

        if (!user.isEnabled) {
          this.userForm.disable();
          this.isAccountEnabled = user.isEnabled ?? true;
        }

        this.updateProfileImageUrl();
        if (user.id) {
          this.followService.getCounts(user.id).subscribe({
            next: (counts) => {
              this.followersCount = counts.followers;
              this.followingCount = counts.following;
            },
            error: (err) => console.error('Error loading follow counts', err),
          });
        }
        return;
      });
  }

  onFollowChanged(isFollowing: boolean): void {
    if (isFollowing) {
      this.followersCount++;
    } else {
      this.followersCount--;
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
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

    if (!this.user.isEnabled) {
      alert('No puedes guardar cambios mientras la cuenta está pausada');
      return;
    }

    this.isLoading = true;

    const formValues = this.userForm.value;

    const userDetailsFreeAreaDTO: UserDetailsFreeAreaDTO = {
      birthdate: formValues.birthdate,
      sex: formValues.sex,
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
    return this.isOwner && this.isEditMode && this.user?.isEnabled === true;
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
        window.location.reload();
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

  canEdit(): boolean {
    return this.isOwner && this.isEditMode && this.user?.isEnabled === true;
  }

  onCountrySelected(country: string): void {
    this.userForm.patchValue({ country, state: '', city: '' });
    this.cityService.setSelectedCountry(country);
  }

  onStateSelected(state: string): void {
    this.userForm.patchValue({ state, city: '' });
  }

  onCitySelected(city: string): void {
    this.userForm.patchValue({ city });
  }

  onViewFollowers(): void {
    if (!this.tokenService.isLogged()) {
      return;
    }

    this.router.navigate([this.user?.username, this.user?.id, 'followers']);
  }

  onViewFollowing(): void {
    if (!this.tokenService.isLogged()) {
      return;
    }
    this.router.navigate([this.user?.username, this.user?.id, 'following']);
  }
}
