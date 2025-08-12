import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { UserDTO } from '../../dto/user-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserFormDTO } from '../../dto/user-form-dto.model';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `http://localhost:8090/ms-users/`;

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
    return this.http.get<UserDTO[]>(this.baseUrl, { params });
  }

  getUserByUsername(username: string): Observable<UserDTO | undefined> {
    return this.http
      .get<UserDTO>(`${this.baseUrl}${username}`)
      .pipe(catchError((error) => of(undefined)));
  }

  save(userFormDTO: UserFormDTO): Observable<User | undefined> {
    return this.http
      .post<User>(`${this.baseUrl}`, userFormDTO)
      .pipe(catchError((error) => of(undefined)));
  }

  update(user: UserDTO): Observable<UserDTO | undefined> {
    return this.http
      .put<UserDTO>(`${this.baseUrl}edit/${user.id}`, user)
      .pipe(catchError((error) => of(undefined)));
  }

  checkUsernameAvailability(
    username: string
  ): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(
      `${this.baseUrl}/check-availability-username/${username}`
    );
  }

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(
      `${this.baseUrl}/check-availability-email/${email}`
    );
  }
}
