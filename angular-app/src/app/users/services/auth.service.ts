import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { env } from 'node:process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  token_url = environment.token_url;
  resource_url = environment.resource_url;

  constructor(private http: HttpClient) {}

  public getToken(code: string, code_verified: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', environment.client_id);
    body.set('redirect_uri', environment.redirect_uri);
    body.set('scope', environment.scope);
    body.set('code_verifier', code_verified);
    body.set('code', code);
    const basic_auth = 'Basic ' + btoa('client:secret');
    const headers_objetct = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
      Authorization: basic_auth,
    });
    const httpOptions = { headers: headers_objetct };
    return this.http.post(this.token_url, body, httpOptions);
  }

  public user():Observable<any> {
    return this.http.get<any>(this.resource_url + 'user');
  }
}
