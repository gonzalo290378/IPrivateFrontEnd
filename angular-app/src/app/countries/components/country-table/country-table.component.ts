import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { Country } from '../../interfaces/country';
import { State } from '../../interfaces/state';
import { StateService } from '../../services/state.service';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-country-table',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './country-table.component.html',
  styles: [
      
  ],
})
export class CountryTableComponent {
  constructor(
    private stateService: StateService,
    private cityService: CityService,
  ) {}

  @Input()
  public countries: Country[] = [];

  public states: State[] = [];

  @Output()
  public countrySelected = new EventEmitter<string>();

  public country: Country[] = [];

  onCountrySelect(countryName: string): void {
    this.cityService.setSelectedCountry(countryName);
    this.countrySelected.emit(countryName);
    this.stateService.getStates(countryName).subscribe((states) => {
      this.states = states;
      this.stateService.setStates(this.states);
    });
  
    this.countries = [];
    this.states = [];
  }
  
}