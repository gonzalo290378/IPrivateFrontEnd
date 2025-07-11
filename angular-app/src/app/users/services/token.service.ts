import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const CODE_VERIFIER = 'code_verifier';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  setTokens(access_token: string, refresh_token: string): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, access_token);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  isLogged(): boolean {
    return localStorage.getItem(ACCESS_TOKEN) !== null;
  }

  isUser(): boolean {
    if (!this.isLogged()) return false;
    const token = this.getAccessToken() as string;
    const payload = token!.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    const roles = decodedPayload.roles;
    if (roles.indexOf('ROLE_USER') < 0) return false;
    return true;
  }

  setVerifier(code_verifier: string): void {
    if (localStorage.getItem(CODE_VERIFIER)) {
      this.deleteVerifier;
    }
    const encrypted = CryptoJS.AES.encrypt(
      code_verifier,
      environment.secret_pkce
    );
    localStorage.setItem(CODE_VERIFIER, encrypted.toString());
  }

  getVerifier(): string {
    const encrypted = localStorage.getItem(CODE_VERIFIER);
    if (!encrypted) {
      return '';
    }
    const decrypted = CryptoJS.AES.decrypt(encrypted, environment.secret_pkce);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  deleteVerifier(): void {
    localStorage.removeItem(CODE_VERIFIER);
  }
}
