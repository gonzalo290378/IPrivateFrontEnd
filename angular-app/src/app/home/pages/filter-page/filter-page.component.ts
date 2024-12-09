import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { ByCountryPageComponent } from '../../../countries/pages/by-country-page/by-country-page.component';

@Component({
  selector: 'app-filter-page',
  standalone: true,
  imports:[
    MaterialModule,
    FormsModule,
    ByCountryPageComponent,
  ],
  templateUrl: './filter-page.component.html',
})

export class FilterPageComponent {
  
  filters = {
    country: '',
    minAge: null,
    maxAge: null,
    gender: '',
  };

  applyFilters() {
    console.log('Filtros aplicados:', this.filters);
    // Aquí podrías emitir un evento o realizar una consulta
  }

  resetFilters() {
    this.filters = {
      country: '',
      minAge: null,
      maxAge: null,
      gender: '',
    };
    console.log('Filtros restablecidos');
  }

}
