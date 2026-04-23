import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { City } from '../../interfaces/city';
import { CityService } from '../../services/city.service';
import { SearchBoxComponent } from '../../../shared/pages/search-box/search-box.component';
import { CityTableComponent } from '../../components/city-table/city-table.component';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';

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
  @Input() selectedCountry: string = '';
  @Input() selectedState: string = '';
  @Input() disabled: boolean = false;
  @Output() citySelected = new EventEmitter<string>();
  public cities: City[] = [];

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cities = [];
  }

  searchByCity(term: string): void {
    if (!term || term.trim() === '') {
      this.cities = [];
      this.citySelected.emit('');
      return;
    }

    const country = this.selectedCountry;
    const state = this.selectedState;

    if (!country || !state) {
      this.cities = [];
      return;
    }

    const url = this.cityService
      .searchByCountryAndState(term, country, state)
      .subscribe((cities) => {
        this.cities = cities;
      });
  }

  updateSearchBox(cityName: string): void {
    this.selectedCity = cityName;
    this.citySelected.emit(cityName);
  }
}
