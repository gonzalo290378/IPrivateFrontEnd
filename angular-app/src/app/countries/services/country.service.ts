import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Country } from '../interfaces/country';

@Injectable({ providedIn: 'root' })
export class CountryService {

  private apiUrl: string = 'http://localhost:8004/api/v1/';


  constructor(private http: HttpClient ) {
  }


  private getCountriesRequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([]) ),
      );
  }

    //EventtEmitter
  searchCountry( term: string ): Observable<Country[]> {
    const url = `${this.apiUrl}countries?name=${term}`;
    return this.getCountriesRequest(url)
      .pipe(
      );
  }

}