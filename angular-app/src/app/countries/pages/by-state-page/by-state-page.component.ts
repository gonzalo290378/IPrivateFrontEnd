import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchBoxComponent } from '../../../shared/pages/search-box/search-box.component';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { State } from '../../interfaces/state';
import { StateService } from '../../services/state.service';
import { StateTableComponent } from '../../components/state-table/state-table.component';

@Component({
  selector: 'app-by-state-page',
  standalone: true,
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

    @Output() stateSelected = new EventEmitter<string>();
  
  public initialValue: string = '';
  public states: State[] = [];
  public selectedState: string = '';

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.states = [];
  }

  searchByState(term: string): void {
    this.stateService.states$.subscribe((states) => {
      this.states = states;
      this.stateService.searchState(term, this.states).subscribe((states) => {
        this.states = states;
      });
    });
  }

  updateSearchBox(stateName: string): void {
    this.selectedState = stateName;
    this.stateSelected.emit(stateName);
  }
}
