import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FreeAreaDTO } from '../../dto/free-area-dto';
import { PrincipalPhotoDTO } from '../../dto/principal-photo-dto';
import { PublicContentDTO } from '../../dto/public-content-dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FreeAreaService {
  private baseUrl = environment.msFreeArea;
  refreshFeed$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  findById(id: number): Observable<any> {
    return this.http
      .get<FreeAreaDTO>(`${this.baseUrl}api/v1/free-area/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  uploadPrincipalPhoto(
    formData: FormData
  ): Observable<PrincipalPhotoDTO | undefined> {
    return this.http
      .post<PrincipalPhotoDTO>(
        `${this.baseUrl}api/v1/free-area/principal-photo/upload`,
        formData
      )
      .pipe(catchError(() => of(undefined)));
  }

  uploadPublicContent(
    formData: FormData,
    freeAreaId: number
  ): Observable<PublicContentDTO | undefined> {
    return this.http
      .post<PublicContentDTO>(
        `${this.baseUrl}api/v1/free-area/${freeAreaId}/public-content`,
        formData
      )
      .pipe(catchError(() => of(undefined)));
  }

  updatePublicContent(
    freeAreaId: number,
    contentId: number,
    description: string
  ): Observable<PublicContentDTO | undefined> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .put<PublicContentDTO>(
        `${this.baseUrl}api/v1/free-area/${freeAreaId}/public-content/${contentId}`,
        { description },
        { headers }
      )
      .pipe(catchError(() => of(undefined)));
  }

  deletePublicContent(freeAreaId: number, contentId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}api/v1/free-area/${freeAreaId}/public-content/${contentId}`
    );
  }
}
