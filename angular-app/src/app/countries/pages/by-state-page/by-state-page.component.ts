import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class ByStatePageComponent implements OnInit, OnChanges {
  @Input() selectedState: string = '';
  @Input() selectedCountry: string = '';
  @Output() stateSelected = new EventEmitter<string>();

  public initialValue: string = '';
  public states: State[] = [];

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.states = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCountry']) {
      const country = changes['selectedCountry'].currentValue;
      this.states = [];
      this.stateService.setStates([]);

      if (country) {
        this.stateService.getStates(country).subscribe((states) => {
          this.stateService.setStates(states);
        });
      }
    }
  }

  onStateChange(value: string) {
    this.stateSelected.emit(value);
  }

  searchByState(term: string): void {
    const currentStates = this.stateService.getCurrentStates();
    if (currentStates.length > 0) {
      this.stateService.searchState(term, currentStates).subscribe((states) => {
        this.states = states;
      });
    }
  }

  updateSearchBox(stateName: string): void {
    this.selectedState = stateName;
    this.states = [];
    this.stateSelected.emit(stateName);
  }
}
