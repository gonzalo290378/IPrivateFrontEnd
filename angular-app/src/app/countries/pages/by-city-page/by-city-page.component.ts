import { Component, OnInit } from '@angular/core';
import { City } from '../../interfaces/city';
import { CityService } from '../../services/city.service';
import { SearchBoxComponent } from '../../../shared/pages/search-box/search-box.component';
import { CityTableComponent } from '../../components/city-table/city-table.component';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { State } from '../../interfaces/state';

@Component({
  selector: 'app-by-city-page',
  standalone: true,
  imports: [
    SearchBoxComponent,
    CityTableComponent,
    MaterialModule,
    SearchBoxComponent,
    FormsModule,
  ],
  templateUrl: './by-city-page.component.html',
})
export class ByCityPageComponent {

  public initialValue: string = '';
  public cities: City[] = [];
  public states: State[] = [];
  public selectedCity: string = '';

  constructor(
    private stateService: StateService,
    private cityService: CityService
  ) {}


  searchByCity(term: string): void {
    this.cityService.cities$.subscribe((cities) => {
      this.cities = cities;
      this.cityService.searchCity(term, cities).subscribe((cities) => {
        this.cities = cities;
      });
    });
  }

  updateSearchBox(cityName: string): void {
    this.selectedCity = cityName;
  }
}
