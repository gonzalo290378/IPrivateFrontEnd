import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { map, Observable, of } from 'rxjs';
import { UserDTO } from '../dto/user-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
  
})
export class UserService {
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  findAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>('http://localhost:8001/')

  }
}
