import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { State } from '../../interfaces/state';
import { CityService } from '../../services/city.service';
import { City } from '../../interfaces/city';

@Component({
  selector: 'app-state-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './state-table.component.html',
})
export class StateTableComponent {
  @Input()
  public states: State[] = [];

  public cities: City[] = [];

  @Output()
  public stateSelected = new EventEmitter<string>();

  constructor(private cityService: CityService) {}

  ngOnChange(): void {
    this.states = [];
  }

  onStateSelect(stateName: string): void {
    this.stateSelected.emit(stateName);
    this.states = [];
    this.cityService.getCities(stateName).subscribe((cities) => {
      this.cities = cities;
      this.cityService.setCities(this.cities);
    });
  }
}
