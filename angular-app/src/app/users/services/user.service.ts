import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { UserDTO } from '../../dto/user-dto';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserFormDTO } from '../../dto/user-form-dto.model';
import { User } from '../../models/user';
import { UserDetailsFreeAreaDTO } from '../../dto/user-details-free-area-dto';
import { TokenService } from './token.service';
import { ResourceService } from './resource.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.msUsers;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private resourceService: ResourceService,
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

  filterUsers(filters: any, page: number, size: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (
      filters.ageFrom !== null &&
      filters.ageFrom !== undefined &&
      filters.ageFrom !== ''
    ) {
      params = params.set('ageFrom', filters.ageFrom);
    }
    if (
      filters.ageTo !== null &&
      filters.ageTo !== undefined &&
      filters.ageTo !== ''
    ) {
      params = params.set('ageTo', filters.ageTo);
    }
    if (filters.sexPreference) {
      params = params.set('sexPreference', filters.sexPreference);
    }
    if (filters.country) {
      params = params.set('country', filters.country);
    }
    if (filters.state) {
      params = params.set('state', filters.state);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.isEnabled !== undefined) {
      params = params.set('isEnabled', filters.isEnabled);
    }
    return this.http.get(`${this.baseUrl}filter`, { params });
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
    userDetailsFreeAreaDTO: UserDetailsFreeAreaDTO,
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
        { headers },
      )
      .pipe(catchError((error) => of(undefined)));
  }

  updatePreferences(preferenceDTO: any): Observable<void> {
    const token = this.tokenService.getAccessToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .put<void>(`${this.baseUrl}preferences`, preferenceDTO, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating preferences', error);
          return of();
        }),
      );
  }

  getPreferences(): Observable<any> {
    const token = this.tokenService.getAccessToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.baseUrl}preferences`, { headers });
  }

  checkUsernameAvailability(
    username: string,
  ): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(
      `${this.baseUrl}/check-availability-username/${username}`,
    );
  }

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(
      `${this.baseUrl}/check-availability-email/${email}`,
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
        { headers },
      )
      .pipe(catchError((error) => of(undefined)));
  }
}
