import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { City } from '../interfaces/city';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CityService {
  private apiUrl: string = environment.msApiExt;
  private citiesSubject = new BehaviorSubject<City[]>([]);
  public cities$ = this.citiesSubject.asObservable();
  private selectedCountrySubject = new BehaviorSubject<string | null>(null);
  public selectedCountry$ = this.selectedCountrySubject.asObservable();
  private selectedStateSubject = new BehaviorSubject<string | null>(null);
  selectedState$ = this.selectedStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  setSelectedState(state: string): void {
    this.selectedStateSubject.next(state || null);
    this.citiesSubject.next([]);
  }

  getSelectedState(): string | null {
    return this.selectedStateSubject.getValue();
  }

  setSelectedCountry(country: string): void {
    this.selectedCountrySubject.next(country);
    this.citiesSubject.next([]);
  }

  getSelectedCountry(): string | null {
    return this.selectedCountrySubject.getValue();
  }

  setCities(cities: City[]): void {
    this.citiesSubject.next(cities);
  }

  getCurrentCities(): City[] {
    return this.citiesSubject.getValue();
  }

  private setCurrentCities(cities: City[]): void {
    this.citiesSubject.next(cities);
  }

  getCities(term: string): Observable<City[]> {
    const selectedCountry = this.getSelectedCountry();
    const url = `${this.apiUrl}cities/citiesByStates?name=${term}&country=${selectedCountry}`;
    return this.getCitiesRequest(url);
  }

  loadCitiesByState(): Observable<City[]> {
    const country = this.getSelectedCountry();
    const state = this.getSelectedState();

    if (!country || !state) return of([]);

    const url = `${this.apiUrl}cities/citiesByStates?name=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}`;

    return this.getCitiesRequest(url).pipe(
      tap((cities: City[]) => this.citiesSubject.next(cities)),
    );
  }

  searchCity(term: string, listCities: City[]): Observable<City[]> {
    const url = `${this.apiUrl}cities/search`;
    const body = { name: term, cities: listCities };
    return this.http.post<City[]>(url, body);
  }

  loadAndSearchCity(term: string): Observable<City[]> {
    const country = this.getSelectedCountry();
    const state = this.getSelectedState();

    if (!country || !state) return of([]);

    const url = `${this.apiUrl}cities/citiesByStates?name=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}`;

    return this.getCitiesRequest(url).pipe(
      tap((cities: City[]) => this.citiesSubject.next(cities)),
      switchMap((cities: City[]) => this.searchCity(term, cities)),
    );
  }

  private getCitiesRequest(url: string): Observable<City[]> {
    return this.http.get<City[]>(url).pipe(catchError(() => of([])));
  }

  searchByCountryAndState(
    term: string,
    country: string,
    state: string,
  ): Observable<City[]> {
    const url = `${this.apiUrl}cities/citiesByStates?name=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}`;

    return this.getCitiesRequest(url).pipe(
      catchError(() => of([])),
      switchMap((cities: City[]) =>
        cities.length > 0 ? this.searchCity(term, cities) : of([]),
      ),
    );
  }
}
