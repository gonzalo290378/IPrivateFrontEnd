import { Component, EventEmitter, Input, Output } from '@angular/core';
import { City } from '../../interfaces/city';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './city-table.component.html',
})
export class CityTableComponent {
  @Input()
  public cities: City[] = [];

  @Output()
  public citySelected = new EventEmitter<string>();

  ngOnChanges(): void {
    if (this.cities.length) {
      this.cities = [];
    }
  }

  onCountrySelect(cityName: string): void {
    this.citySelected.emit(cityName);
    this.cities = [];
  }
}
