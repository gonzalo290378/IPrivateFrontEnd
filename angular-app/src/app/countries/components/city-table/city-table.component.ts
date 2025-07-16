import { Component, EventEmitter, Input, Output } from '@angular/core';
import { City } from '../../interfaces/city';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-city-table',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './city-table.component.html',
})
export class CityTableComponent {
  @Input()
  public cities: City[] = [];

  @Output()
  public citySelected = new EventEmitter<string>();

  constructor(private cityService: CityService) {}

  onCitySelect(cityName: string): void {
    this.citySelected.emit(cityName);
    this.cities = [];
  }
}
