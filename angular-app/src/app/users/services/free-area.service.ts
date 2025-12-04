import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  refreshFeed$ = new Subject<void>();

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

  updatePublicContent(
    freeAreaId: number,
    contentId: number,
    description: string
  ): Observable<PublicContentDTO | undefined> {
    const token = this.tokenService.getAccessToken();
    console.log('descripcion nueva', description);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http
      .put<PublicContentDTO>(
        `${this.baseUrl}api/v1/free-area/${freeAreaId}/public-content/${contentId}`,
        { description },
        { headers }
      )
      .pipe(catchError(() => of(undefined)));
  }

  deletePublicContent(freeAreaId: number, contentId: number): Observable<void> {
    const token = this.tokenService.getAccessToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.delete<void>(
      `${this.baseUrl}api/v1/free-area/${freeAreaId}/public-content/${contentId}`,
      { headers }
    );
  }
}
