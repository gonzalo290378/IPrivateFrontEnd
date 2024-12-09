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
    FilterPageComponent,
],
  templateUrl: './navbar-page.component.html',
  styleUrl: './navbar-page.component.css'
})
export class NavbarPageComponent {

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
