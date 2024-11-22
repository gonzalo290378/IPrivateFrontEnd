import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-page',
  standalone: true,
  imports:[
    MaterialModule,
    RouterLink,
    FormsModule,

  ],
  templateUrl: './filter-page.component.html',
})
export class FilterPageComponent {
  // Filtros
  filters = {
    name: '',
    minAge: null,
    maxAge: null,
    gender: '',
  };

  // Aplicar filtros
  applyFilters() {
    console.log('Filtros aplicados:', this.filters);
    // Aquí podrías emitir un evento o realizar una consulta
  }

  // Restablecer filtros
  resetFilters() {
    this.filters = {
      name: '',
      minAge: null,
      maxAge: null,
      gender: '',
    };
    console.log('Filtros restablecidos');
  }


}
