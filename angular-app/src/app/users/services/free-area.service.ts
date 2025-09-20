import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { UserDTO } from '../../dto/user-dto';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserFormDTO } from '../../dto/user-form-dto.model';
import { User } from '../../models/user';
import { FreeAreaDTO } from '../../dto/free-area-dto';
import { PrincipalPhotoDTO } from '../../dto/principal-photo-dto';
import { TokenService } from './token.service';
import { ResourceService } from './resource.service';
import { PublicContentDTO } from '../../dto/public-content-dto';

@Injectable({
  providedIn: 'root',
})
export class FreeAreaService {
  private baseUrl = `http://localhost:8090/ms-free-area/`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private resourceService: ResourceService
  ) {}

  findById(id: number): Observable<any> {
    return this.http
      .get<FreeAreaDTO>(`${this.baseUrl}api/v1/free-area/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  uploadPrincipalPhoto(
    formData: FormData
  ): Observable<PrincipalPhotoDTO | undefined> {
    const token = this.tokenService.getAccessToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .post<PrincipalPhotoDTO>(
        `${this.baseUrl}api/v1/free-area/principal-photo/upload`,
        formData,
        { headers }
      )
      .pipe(catchError(() => of(undefined)));
  }

  uploadPublicContent(
    formData: FormData,
    freeAreaId: number
  ): Observable<PublicContentDTO | undefined> {
    const token = this.tokenService.getAccessToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http
      .post<PublicContentDTO>(
        `${this.baseUrl}api/v1/free-area/${freeAreaId}/public-content`,
        formData,
        { headers }
      )
      .pipe(catchError(() => of(undefined)));
  }

  //SECURIZAR
  save(userFormDTO: UserFormDTO): Observable<User | undefined> {
    return this.http
      .post<User>(`${this.baseUrl}`, userFormDTO)
      .pipe(catchError((error) => of(undefined)));
  }

  //SECURIZAR
  update(user: UserDTO): Observable<UserDTO | undefined> {
    return this.http
      .put<UserDTO>(`${this.baseUrl}edit/${user.id}`, user)
      .pipe(catchError((error) => of(undefined)));
  }
}
