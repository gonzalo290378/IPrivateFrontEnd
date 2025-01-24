import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { ByCityPageComponent } from '../../../countries/pages/by-city-page/by-city-page.component';
import { ByCountryPageComponent } from '../../../countries/pages/by-country-page/by-country-page.component';
import { ByStatePageComponent } from '../../../countries/pages/by-state-page/by-state-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../users/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-page',
    imports: [
        MaterialModule,
        ByCityPageComponent,
        ByCountryPageComponent,
        ByStatePageComponent,
        CommonModule,
    ],
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
  userForm!: FormGroup;
  locationForm!: FormGroup;
  preferencesForm!: FormGroup;
  filteredStates: string[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      sex: ['', Validators.required],
      birthdate: ['', [Validators.required, this.ageRangeValidator]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(256),
        ],
      ],
    });

    this.locationForm = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });

    this.preferencesForm = this.fb.group({
      sexPreference: ['', Validators.required],
      ageFrom: ['', [Validators.required, Validators.min(18)]],
      ageTo: ['', [Validators.required, Validators.max(90)]],
      description: ['', Validators.required],
    });

    this.filteredStates = [];
  }

  onCountryChange(country: string): void {
    this.locationForm.get('country')?.setValue(country);
  }

  onStateChange(state: string): void {
    this.locationForm.get('state')?.setValue(state);
  }

  onCityChange(city: string): void {
    this.locationForm.get('city')?.setValue(city);
  }

  ageRangeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthdate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age - 1;
    }

    if (age < 18 || age > 90) {
      return { ageRange: true };
    }

    return null;
  }

  submit() {
    const userData = {
      ...this.userForm.value,
      ...this.locationForm.value,
      ...this.preferencesForm.value,
    };
    console.log('Datos del registro:', userData);

    this.userService.save(userData).subscribe((response) => {
      if (response) {
        Swal.fire(
          'Usuario creado exitosamente!',
          'El usuario ha sido creado correctamente.',
          'success'
        ).then(() => {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        });
      } else {
        Swal.fire(
          'Error!',
          'Hubo un problema al crear el usuario. Inténtalo nuevamente.',
          'error'
        );
      }
    });
  }
}
