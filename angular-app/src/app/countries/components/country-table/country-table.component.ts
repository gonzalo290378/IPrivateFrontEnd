import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'country-table',
  standalone: true,
  imports:[
    MaterialModule,
    RouterLink,
    CommonModule,
    FormsModule,

  ],
  templateUrl: './country-table.component.html',
  styles: [
    `img {
      width: 25px;
    }`
  ]
})
export class CountryTableComponent {

  @Input()
  public countries: Country[] = [];

  ngOnChanges(): void {
    if(this.countries.length === 214){
      this.countries = [];
    }
  }

}
