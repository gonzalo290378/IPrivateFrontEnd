import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { State } from '../../interfaces/state';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-state-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './state-table.component.html',
})

export class StateTableComponent implements OnInit {
  
  @Input()
  public states: State[] = [];

  @Output()
  public stateSelected = new EventEmitter<string>();

  constructor(private stateService: StateService) {}


  ngOnInit(): void {
    this.stateService.states$.subscribe((states) => {
      this.states = states;
      console.log('States received in StateTableComponent:', this.states);
    });
  }

  ngOnChanges(): void {
    if (this.states.length) {
      console.log('states', this.states);
      this.states = [];
    }
  }

  onStateSelect(stateName: string): void {
    this.stateSelected.emit(stateName);
    this.states = [];
  }
}
