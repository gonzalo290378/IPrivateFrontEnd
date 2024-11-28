import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { map, Observable, of } from 'rxjs';
import { UserDTO } from '../dto/user-dto';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseUrl = 'http://localhost:8001/'; // Cambia a tu endpoint real

  constructor(private http: HttpClient) {}


  findAll(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.baseUrl, { params });
  }

  filter(page: number, size: number): Observable<UserDTO[]> {
    const params = {
      page: page,
      size: size,
    };
    return this.http.get<UserDTO[]>('http://localhost:8001/', { params });
  }
}
