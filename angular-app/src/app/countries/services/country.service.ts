import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, map, tap } from 'rxjs';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Country } from '../interfaces/country';

@Injectable({ providedIn: 'root' })
export class CountryService {

  private apiUrl: string = 'http://localhost:8004/api/v1/';

  public cacheStore: CacheStore = {
    byCountries: { term: '', countries: [] },
  }

  constructor(private http: HttpClient ) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem( 'cacheStore', JSON.stringify( this.cacheStore ));
  }

  private loadFromLocalStorage() {
    if ( !localStorage.getItem('cacheStore') ) return;

    this.cacheStore = JSON.parse( localStorage.getItem('cacheStore')! );
  }

  private getCountriesRequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([]) ),
        // delay( 2000 ),
      );
  }



  searchCountry( term: string ): Observable<Country[]> {

    const url = `${this.apiUrl}countries?name=${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term, countries }),
        tap( () => this.saveToLocalStorage() ),
      );
  }




}