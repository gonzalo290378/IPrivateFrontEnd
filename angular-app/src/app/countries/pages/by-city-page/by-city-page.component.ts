import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  imports: [
    SearchBoxComponent,
    CityTableComponent,
    MaterialModule,
    SearchBoxComponent,
    FormsModule,
  ],
  templateUrl: './by-city-page.component.html',
})
export class ByCityPageComponent implements OnInit {
  @Input() selectedCity: string = '';
  @Input() disabled: boolean = false;
  @Output() citySelected = new EventEmitter<string>();
  public initialValue: string = '';
  public cities: City[] = [];
  public states: State[] = [];

  constructor(
    private stateService: StateService,
    private cityService: CityService,
  ) {}

  ngOnInit(): void {
    this.cities = [];
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
    }
  }

  updateSearchBox(cityName: string): void {
    this.selectedCity = cityName;
    this.citySelected.emit(cityName);
  }
}
