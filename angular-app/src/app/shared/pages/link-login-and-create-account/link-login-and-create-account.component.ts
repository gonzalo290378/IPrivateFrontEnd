import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '../../../users/services/auth.service';
import { TokenService } from '../../../users/services/token.service';
import * as CryptoJS from 'crypto-js';

const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

@Component({
  selector: 'app-link-login-and-create-account',
  imports: [MaterialModule, RouterLink],
  templateUrl: './link-login-and-create-account.component.html',
})
export class LinkLoginAndCreateAccountComponent implements OnInit {
  authorize_uri = environment.authorize_uri;
  params: any = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    scope: environment.scope,
    response_type: environment.response_type,
    response_mode: environment.response_mode,
    code_challenge_method: environment.code_challenge_method,
  };
  logout_url = environment.logout_url;
  isLogged: boolean = false;
  isUser: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.getLogged();
  }

  onLogin(): void {
    const code_verifier = this.generateCodeVerifier();
    this.tokenService.setVerifier(code_verifier);
    this.params.code_challenge = this.generateCodeChallenge(code_verifier);
    const htmlParams = new HttpParams({ fromObject: this.params });
    const codeUrl = this.authorize_uri + htmlParams.toString();
    location.href = codeUrl;
  }

  onLogout(): void {
    this.tokenService.clear();
    location.href = this.logout_url;
    location.href = 'http://localhost:4200';
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isUser = this.tokenService.isUser();
  }

  generateCodeVerifier(): string {
    let result = '';
    const charactersLength = CHARACTERS.length;
    for (let i = 0; i < 44; i++) {
      result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateCodeChallenge(codeVerifier: string): string {
    const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(
      CryptoJS.enc.Base64
    );
    const code_callenge = codeVerifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return code_callenge;
  }
}
