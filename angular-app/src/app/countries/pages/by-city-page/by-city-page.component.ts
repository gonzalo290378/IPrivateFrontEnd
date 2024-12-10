import { Component, OnInit } from '@angular/core';
import { City } from '../../interfaces/city';
import { CityService } from '../../services/city.service';
import { SearchBoxComponent } from '../../../shared/pages/search-box/search-box.component';
import { CityTableComponent } from '../../components/city-table/city-table.component';
import { MaterialModule } from '../../../material/material-module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-by-city-page',
  standalone: true,
  imports: [
    SearchBoxComponent,
    CityTableComponent,
    MaterialModule,
    SearchBoxComponent,
    FormsModule,
  ],
  templateUrl: './by-city-page.component.html',
})
export class ByCityPageComponent implements OnInit {
  public initialValue: string = '';
  public cities: City[] = [];
  public selectedCity: string = '';

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cities = [];
  }


  searchByCity( term: string ):void  {
    this.cityService.searchCity( term )
      .subscribe( cities => {
        this.cities = cities;
      });
  }

  updateSearchBox(cityName: string): void {
    this.selectedCity = cityName;
  }
}
