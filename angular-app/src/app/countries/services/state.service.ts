// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, of, catchError } from 'rxjs';
// import { State } from '../interfaces/state';

// @Injectable({ providedIn: 'root' })
// export class StateService {
//   private apiUrl: string = 'http://localhost:8004/api/v1/';

//   private statesSubject = new BehaviorSubject<State[]>([]);
//   public states$ = this.statesSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   getStates(term: string): Observable<State[]> {
//     const url = `${this.apiUrl}countries/statesByCountry?name=${term}`;
//     return this.getStatesRequest(url).pipe(
//       catchError(() => of([])) // Manejo de errores
//     );
//   }

//   setStates(states: State[]): void {
//     this.statesSubject.next(states);
//   }

//   getCurrentStates(): State[] {
//     return this.statesSubject.getValue();
//   }

//     //ESTE FUNCIONA MAL
//   searchState(term: string): Observable<State[]> {
//     const url = `${this.apiUrl}states?name=${term}`;
//     return this.getStatesRequest(url).pipe(
//     );
//   }

//   private getStatesRequest(url: string): Observable<State[]> {
//     return this.http.get<State[]>(url).pipe(catchError(() => of([])));
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError } from 'rxjs';
import { State } from '../interfaces/state';

@Injectable({ providedIn: 'root' })
export class StateService {

  private apiUrl: string = 'http://localhost:8004/api/v1/';
  private statesSubject = new BehaviorSubject<State[]>([]);
  public states$ = this.statesSubject.asObservable();

  constructor(private http: HttpClient) {
  }


  getStates(term: string): Observable<State[]> {
    const url = `${this.apiUrl}countries/statesByCountry?name=${term}`;
    return this.getStatesRequest(url).pipe(
    );
  }

  setStates(states: State[]): void {
    this.statesSubject.next(states);
  }

  getCurrentStates(): State[] {
    return this.statesSubject.getValue();
  }

  //ESTE FUNCIONA MAL
  searchState(term: string): Observable<State[]> {
    const url = `${this.apiUrl}states?name=${term}`;
    return this.getStatesRequest(url).pipe(
    );
  }


  private getStatesRequest(url: string): Observable<State[]> {
    return this.http.get<State[]>(url).pipe(catchError(() => of([])));
  }
}