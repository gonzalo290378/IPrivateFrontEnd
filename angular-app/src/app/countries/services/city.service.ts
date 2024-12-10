import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, map, tap, delay } from 'rxjs';
// import { CacheStore } from '../interfaces/cache-store.interface';
import { Country } from '../interfaces/country';
import { City } from '../interfaces/city';

@Injectable({ providedIn: 'root' })
export class CityService {
  private apiUrl: string = 'http://localhost:8004/api/v1/';

  constructor(private http: HttpClient) {
  }



  private getCitiesRequest(url: string): Observable<City[]> {
    return this.http.get<City[]>(url).pipe(
      catchError(() => of([]))
      //delay( 2000 ),
    );
  }

  //EventtEmitter
  searchCity(term: string): Observable<City[]> {
    const url = `${this.apiUrl}cities?name=${term}`;
    return this.getCitiesRequest(url).pipe(
    );
  }
}
