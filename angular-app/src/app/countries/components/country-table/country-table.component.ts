import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';
import { State } from '../../interfaces/state';
import { StateService } from '../../services/state.service';

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
    private countryService: CountryService,
    private cityService: CityService,
    private stateService: StateService
  ) {}

  @Input()
  public countries: Country[] = [];

  public states: State[] = [];

  @Output()
  public countrySelected = new EventEmitter<string>();

  public country: Country[] = [];

  ngOnChanges(): void {
    if (this.countries.length === 214) {
      this.countries = [];
    }
  }


  onCountrySelect(countryName: string): void {
    this.countrySelected.emit(countryName);
  
    this.stateService.getStates(countryName).subscribe((state) => {
      this.states = state;
      console.log("VER1", this.states);
  
      // Emitir los estados al servicio compartido
      this.stateService.setStates(this.states);
    });
  
    this.countries = [];
    this.states = [];
  }
  
}