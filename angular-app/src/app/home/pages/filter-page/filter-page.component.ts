import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { ByCountryPageComponent } from '../../../countries/pages/by-country-page/by-country-page.component';
import { ByCityPageComponent } from '../../../countries/pages/by-city-page/by-city-page.component';
import { ByStatePageComponent } from '../../../countries/pages/by-state-page/by-state-page.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../users/services/user.service';

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
})
export class FilterPageComponent {
  @Output() filtersEmitted = new EventEmitter<any>();
  filters = {
    country: '',
    state: '',
    city: '',
    ageFrom: null,
    ageTo: null,
    sexPreference: '',
  };

  constructor(private userService: UserService) {}

  ageFromInvalid: boolean = false;
  ageToInvalid: boolean = false;
  ageRangeInvalid: boolean = false;
  sexInvalid: boolean = false;

  onAgeChange() {
    this.validateFilters();
  }

  validateFilters() {
    // Resetear errores
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

    if ((hasAgeFrom && !hasAgeTo) || (!hasAgeFrom && hasAgeTo)) {
      return false;
    }

    if (hasAgeFrom && hasAgeTo) {
      const ageFrom = Number(this.filters.ageFrom);
      const ageTo = Number(this.filters.ageTo);

      if (isNaN(ageFrom) || isNaN(ageTo)) {
        return false;
      }

      if (ageFrom < 18 || ageFrom > 90 || ageTo < 18 || ageTo > 90) {
        return false;
      }

      if (ageFrom > ageTo) {
        return false;
      }
    }

    if (!this.filters.sexPreference) {
      return false;
    }

    return true;
  }


  applyFilters() {
    const isValid = this.validateFilters();
    if (!isValid) return;
    this.filtersEmitted.emit({ ...this.filters }); // 👈 reemplaza la llamada al servicio
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
