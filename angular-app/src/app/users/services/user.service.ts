import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { UserDTO } from '../../dto/user-dto';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserFormDTO } from '../../dto/user-form-dto.model';
import { User } from '../../models/user';
import { UserDetailsFreeAreaDTO } from '../../dto/user-details-free-area-dto';
import { TokenService } from './token.service';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `http://localhost:8090/ms-users/`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private resourceService: ResourceService
  ) {}

  findAll(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.baseUrl, { params });
  }

  getEntityByUsername(username: string): Observable<UserDTO | undefined> {
    return this.http
      .get<UserDTO>(`${this.baseUrl}username`, {
        params: { username },
      })
      .pipe(catchError(() => of(undefined)));
  }

  filter(page: number, size: number): Observable<UserDTO[]> {
    const params = {
      page: page,
      size: size,
    };
    return this.http.get<UserDTO[]>(this.baseUrl, { params });
  }

  checkAvailabilityUsername(username: string): Observable<UserDTO | undefined> {
    return this.http
      .get<UserDTO>(`${this.baseUrl}check-availability-username/${username}`)
      .pipe(catchError((error) => of(undefined)));
  }

  save(userFormDTO: UserFormDTO): Observable<User | undefined> {
    return this.http
      .post<User>(`${this.baseUrl}`, userFormDTO)
      .pipe(catchError((error) => of(undefined)));
  }

  updateDetailsFreeArea(
    username: string,
    userDetailsFreeAreaDTO: UserDetailsFreeAreaDTO
  ): Observable<UserDetailsFreeAreaDTO | undefined> {
    const token = this.tokenService.getAccessToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .put<UserDetailsFreeAreaDTO>(
        `${this.baseUrl}edit/${username}`,
        userDetailsFreeAreaDTO,
        { headers }
      )
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

  deleteUser(id: number): Observable<UserDetailsFreeAreaDTO | undefined> {
    const token = this.tokenService.getAccessToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .delete<UserDetailsFreeAreaDTO>(`${this.baseUrl}delete/${id}`, {
        headers,
      })
      .pipe(catchError((error) => of(undefined)));
  }

  reactivateUser(id: number) {
    const token = this.tokenService.getAccessToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http
      .put<UserDetailsFreeAreaDTO>(
        `${this.baseUrl}${id}/reactivate`,
        {},
        { headers }
      )
      .pipe(catchError((error) => of(undefined)));
  }
}
