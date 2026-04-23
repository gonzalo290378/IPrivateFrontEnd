import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { City } from '../../interfaces/city';
import { CityService } from '../../services/city.service';
import { SearchBoxComponent } from '../../../shared/pages/search-box/search-box.component';
import { CityTableComponent } from '../../components/city-table/city-table.component';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-by-city-page',
  imports: [
    SearchBoxComponent,
    CityTableComponent,
    MaterialModule,
    FormsModule,
  ],
  templateUrl: './by-city-page.component.html',
})
export class ByCityPageComponent implements OnInit {
  @Input() selectedCity: string = '';
  @Input() disabled: boolean = false;
  @Output() citySelected = new EventEmitter<string>();
  public cities: City[] = [];

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cities = [];

    // Precarga ciudades si ya hay país y estado seteados
    this.cityService.selectedState$.pipe(
      filter(state => !!state),
      switchMap(() => this.cityService.loadCitiesByState())
    ).subscribe();
  }

  searchByCity(term: string): void {
    if (!term || term.trim() === '') {
      this.cities = [];
      this.citySelected.emit('');
      return;
    }

    const currentCities = this.cityService.getCurrentCities();

    if (currentCities.length > 0) {
      this.cityService.searchCity(term, currentCities).subscribe((cities) => {
        this.cities = cities;
      });
    } else {
      this.cityService.loadAndSearchCity(term).subscribe((cities) => {
        this.cities = cities;
      });
    }
  }

  updateSearchBox(cityName: string): void {
    this.selectedCity = cityName;
    this.citySelected.emit(cityName);
  }
}
