import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError } from 'rxjs';
import { State } from '../interfaces/state';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StateService {
  private apiUrl: string = environment.msApiExt;
  private statesSubject = new BehaviorSubject<State[]>([]);
  public states$ = this.statesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getStates(term: string): Observable<State[]> {
    const url = `${this.apiUrl}countries/statesByCountry?name=${term}`;
    return this.getStatesRequest(url).pipe();
  }

  setStates(states: State[]): void {
    this.statesSubject.next(states);
  }

  getCurrentStates(): State[] {
    return this.statesSubject.getValue();
  }

  searchState(term: string, listStates: State[]): Observable<State[]> {
    const url = `${this.apiUrl}states/search`;
    const body = {
      name: term,
      states: listStates,
    };
    return this.http.post<State[]>(url, body);
  }

  private getStatesRequest(url: string): Observable<State[]> {
    return this.http.get<State[]>(url).pipe(catchError(() => of([])));
  }
}
