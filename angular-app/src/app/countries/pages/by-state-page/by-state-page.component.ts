import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchBoxComponent } from '../../../shared/pages/search-box/search-box.component';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { State } from '../../interfaces/state';
import { StateService } from '../../services/state.service';
import { StateTableComponent } from '../../components/state-table/state-table.component';

@Component({
  selector: 'app-by-state-page',
  imports: [
    SearchBoxComponent,
    MaterialModule,
    SearchBoxComponent,
    FormsModule,
    StateTableComponent,
  ],
  templateUrl: './by-state-page.component.html',
})
export class ByStatePageComponent implements OnInit {
  @Input() selectedState: string = '';
  @Input() selectedCountry: string = '';
  @Output() stateSelected = new EventEmitter<string>();

  public initialValue: string = '';
  public states: State[] = [];

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.states = [];
    if (this.selectedCountry) {
      this.stateService.getStates(this.selectedCountry).subscribe((states) => {
        this.stateService.setStates(states);
      });
    }
  }

  onStateChange(value: string) {
    this.stateSelected.emit(value);
  }

  searchByState(term: string): void {
    this.stateSelected.emit(term);

    if (!term || term.trim() === '') {
      this.states = [];
      return;
    }

    const currentStates = this.stateService.getCurrentStates();
    if (currentStates.length > 0) {
      this.stateService.searchState(term, currentStates).subscribe((states) => {
        this.states = states;
      });
    }
  }

  updateSearchBox(stateName: string): void {
    this.selectedState = stateName;
    this.stateSelected.emit(stateName);
  }
}
