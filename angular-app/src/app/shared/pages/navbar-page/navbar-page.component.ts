import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPageComponent } from "../../../home/pages/filter-page/filter-page.component";


@Component({
  selector: 'app-navbar-page',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    FormsModule,
    FilterPageComponent
],
  templateUrl: './navbar-page.component.html',
  styleUrl: './navbar-page.component.css'
})
export class NavbarPageComponent {

  isDrawerOpen = false;

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  onDrawerToggle(isOpen: boolean) {
    this.isDrawerOpen = isOpen;
  }

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
