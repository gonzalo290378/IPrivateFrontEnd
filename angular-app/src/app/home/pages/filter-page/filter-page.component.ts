import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { ByCountryPageComponent } from '../../../countries/pages/by-country-page/by-country-page.component';
import { ByCityPageComponent } from '../../../countries/pages/by-city-page/by-city-page.component';
import { ByStatePageComponent } from '../../../countries/pages/by-state-page/by-state-page.component';

@Component({
  selector: 'app-filter-page',
  imports: [
    MaterialModule,
    FormsModule,
    ByCountryPageComponent,
    ByCityPageComponent,
    ByStatePageComponent,
  ],
  templateUrl: './filter-page.component.html',
})
export class FilterPageComponent {
  filters = {
    country: '',
    state: '',
    city: '',
    ageFrom: null,
    ageTo: null,
    sexPreference: '',
  };

  applyFilters() {
    console.log('Filtros aplicados:', this.filters);
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
    console.log('Filtros restablecidos');
  }
}
