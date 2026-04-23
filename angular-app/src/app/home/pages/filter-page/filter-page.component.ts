import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { ByCountryPageComponent } from '../../../countries/pages/by-country-page/by-country-page.component';
import { ByCityPageComponent } from '../../../countries/pages/by-city-page/by-city-page.component';
import { ByStatePageComponent } from '../../../countries/pages/by-state-page/by-state-page.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../users/services/user.service';
import { CityService } from '../../../countries/services/city.service';
import { TokenService } from '../../../users/services/token.service';

@Component({
  selector: 'app-filter-page',
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    ByCountryPageComponent,
    ByCityPageComponent,
    ByStatePageComponent,
  ],
  templateUrl: './filter-page.component.html',
  styleUrl: './filter-page.component.css',
})
export class FilterPageComponent implements OnInit {
  ngOnInit() {
    if (!this.tokenService.isLogged()) return;

    this.userService.getPreferences().subscribe({
      next: (pref) => {
        if (!pref) return;

        this.filters = {
          country: pref.filterCountry?.country || '',
          state: pref.filterState?.state || '',
          city: pref.filterCity?.city || '',
          ageFrom: pref.ageFrom ?? null,
          ageTo: pref.ageTo ?? null,
          sexPreference: pref.sexPreference || '',
        };

        if (this.filters.country) {
          this.cityService.setSelectedCountry(this.filters.country);
        }

        if (this.filters.state) {
          this.cityService.setSelectedState(this.filters.state);
        }

        this.filtersEmitted.emit({ ...this.filters });
      },
      error: (err) => console.error('Error loading preferences', err),
    });
  }

  @Output() filtersEmitted = new EventEmitter<any>();
  filters = {
    country: '',
    state: '',
    city: '',
    ageFrom: null,
    ageTo: null,
    sexPreference: '',
  };

  constructor(
    private userService: UserService,
    private cityService: CityService,
    private tokenService: TokenService,
  ) {}

  ageFromInvalid: boolean = false;
  ageToInvalid: boolean = false;
  ageRangeInvalid: boolean = false;
  sexInvalid: boolean = false;

  onAgeChange() {
    this.validateFilters();
  }

  validateFilters() {
    this.ageFromInvalid = false;
    this.ageToInvalid = false;
    this.ageRangeInvalid = false;
    this.sexInvalid = false;

    const hasAgeFrom =
      this.filters.ageFrom !== null && this.filters.ageFrom !== '';
    const hasAgeTo = this.filters.ageTo !== null && this.filters.ageTo !== '';

    if ((hasAgeFrom && !hasAgeTo) || (!hasAgeFrom && hasAgeTo)) {
      this.ageFromInvalid = !hasAgeFrom;
      this.ageToInvalid = !hasAgeTo;
      return false;
    }

    if (hasAgeFrom && hasAgeTo) {
      const ageFrom = Number(this.filters.ageFrom);
      const ageTo = Number(this.filters.ageTo);

      if (isNaN(ageFrom) || isNaN(ageTo)) {
        this.ageFromInvalid = isNaN(ageFrom);
        this.ageToInvalid = isNaN(ageTo);
        return false;
      }

      if (ageFrom < 18 || ageFrom > 90) {
        this.ageFromInvalid = true;
      }
      if (ageTo < 18 || ageTo > 90) {
        this.ageToInvalid = true;
      }

      if (ageFrom > ageTo) {
        this.ageRangeInvalid = true;
      }

      if (this.ageFromInvalid || this.ageToInvalid || this.ageRangeInvalid) {
        return false;
      }
    }

    this.sexInvalid = !this.filters.sexPreference;
    return !this.sexInvalid;
  }

  isFormValid(): boolean {
    const hasAgeFrom =
      this.filters.ageFrom !== null && this.filters.ageFrom !== '';
    const hasAgeTo = this.filters.ageTo !== null && this.filters.ageTo !== '';

    if ((hasAgeFrom && !hasAgeTo) || (!hasAgeFrom && hasAgeTo)) return false;

    if (hasAgeFrom && hasAgeTo) {
      const ageFrom = Number(this.filters.ageFrom);
      const ageTo = Number(this.filters.ageTo);
      if (isNaN(ageFrom) || isNaN(ageTo)) return false;
      if (ageFrom < 18 || ageFrom > 90 || ageTo < 18 || ageTo > 90)
        return false;
      if (ageFrom > ageTo) return false;
    }

    if (!this.filters.sexPreference) return false;

    return true;
  }

  applyFilters() {
    const isValid = this.validateFilters();
    if (!isValid) return;

    const preferenceDTO = {
      ageFrom: this.filters.ageFrom,
      ageTo: this.filters.ageTo,
      sexPreference: this.filters.sexPreference,
      filterCountry: this.filters.country
        ? { country: this.filters.country }
        : null,
      filterState: this.filters.state ? { state: this.filters.state } : null,
      filterCity: this.filters.city ? { city: this.filters.city } : null,
    };

    this.filtersEmitted.emit({ ...this.filters });

    if (this.tokenService.isLogged()) {
      this.userService.updatePreferences(preferenceDTO).subscribe({
        next: () => {
          console.log('Preferences updated successfully', preferenceDTO);
        },
        error: (err) => {
          console.error('Error updating preferences', err);
        },
      });
    } else {
      console.log(
        'Usuario invitado: no se guardan preferencias en el servidor',
        preferenceDTO,
      );
    }

    console.log('Filter Options Selected', preferenceDTO);
  }

  onCountrySelected(country: string): void {
    this.filters = {
      ...this.filters,
      country: country,
      state: '',
      city: '',
    };
    this.cityService.setSelectedCountry(country);
  }

  onStateSelected(state: string): void {
    this.filters = {
      ...this.filters,
      state: state,
      city: '',
    };
    this.cityService.setSelectedState(state);
  }

  onCitySelected(city: string): void {
    this.filters.city = city;
  }

  resetFilters() {
    this.filters = {
      country: '',
      state: '',
      city: '',
      ageFrom: null,
      ageTo: null,
      sexPreference: '',
    };
    this.ageFromInvalid = false;
    this.ageToInvalid = false;
    this.ageRangeInvalid = false;
    this.sexInvalid = false;
  }
}
