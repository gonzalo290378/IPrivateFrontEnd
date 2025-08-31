import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { UserDTO } from '../../dto/user-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserFormDTO } from '../../dto/user-form-dto.model';
import { User } from '../../models/user';
import { FreeAreaDTO } from '../../dto/free-area-dto';

@Injectable({
  providedIn: 'root',
})
export class FreeAreaService {
  private baseUrl = `http://localhost:8090/ms-free-area/`;

  constructor(private http: HttpClient) {}

  findById(id: number): Observable<any> {
    return this.http
    .get<FreeAreaDTO>(`${this.baseUrl}api/v1/free-area/${id}`)
    .pipe(catchError((error) => of(undefined)));
  }

  // filter(page: number, size: number): Observable<UserDTO[]> {
  //   const params = {
  //     page: page,
  //     size: size,
  //   };
  //   return this.http.get<UserDTO[]>(this.baseUrl, { params });
  // }

  // checkAvailabilityUsername(username: string): Observable<UserDTO | undefined> {
  //   return this.http
  //     .get<UserDTO>(`${this.baseUrl}check-availability-username/${username}`)
  //     .pipe(catchError((error) => of(undefined)));
  // }

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

  // checkUsernameAvailability(
  //   username: string
  // ): Observable<{ available: boolean }> {
  //   return this.http.get<{ available: boolean }>(
  //     `${this.baseUrl}/check-availability-username/${username}`
  //   );
  // }

  // checkEmailAvailability(email: string): Observable<{ available: boolean }> {
  //   return this.http.get<{ available: boolean }>(
  //     `${this.baseUrl}/check-availability-email/${email}`
  //   );
  // }
}
