import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { City } from '../interfaces/city';

@Injectable({ providedIn: 'root' })
export class CityService {
  
  private apiUrl: string = 'http://localhost:8004/api/v1/';
  private citiesSubject = new BehaviorSubject<City[]>([]);
  public cities$ = this.citiesSubject.asObservable();
  private selectedCountrySubject = new BehaviorSubject<string | null>(null);
  public selectedCountry$ = this.selectedCountrySubject.asObservable();

  constructor(private http: HttpClient) {}

  getCities(term: string): Observable<City[]> {
    const selectedCountry = this.getSelectedCountry();
    const url = `${this.apiUrl}cities/citiesByStates?name=${term}&country=${selectedCountry}`;
    return this.getCitiesRequest(url).pipe();
  }

  searchCity(term: string, listCities: City[]): Observable<City[]> {
    const url = `${this.apiUrl}cities/search`;
    const body = {
      name: term,
      cities: listCities,
    };
    return this.http.post<City[]>(url, body);
  }

  setCities(cities: City[]): void {
    this.citiesSubject.next(cities);
  }

  getCurrentCities(): City[] {
    return this.citiesSubject.getValue();
  }

  private getCitiesRequest(url: string): Observable<City[]> {
    return this.http.get<City[]>(url).pipe(
      catchError(() => of([]))
      //delay( 2000 ),
    );
  }

  setSelectedCountry(country: string): void {
    this.selectedCountrySubject.next(country);
  }

  getSelectedCountry(): string | null {
    return this.selectedCountrySubject.getValue();
  }
}
