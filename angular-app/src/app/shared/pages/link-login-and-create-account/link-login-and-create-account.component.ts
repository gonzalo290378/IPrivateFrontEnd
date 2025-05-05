import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '../../../users/services/auth.service';

@Component({
    selector: 'app-link-login-and-create-account',
    imports: [
        MaterialModule,
        RouterLink,
    ],
    templateUrl: './link-login-and-create-account.component.html'
})
export class LinkLoginAndCreateAccountComponent implements OnInit{

    authorize_uri = environment.authorize_uri;
    params: any = {
      client_id: environment.client_id,
      redirect_uri: environment.redirect_uri,
      scope: environment.scope,
      response_type: environment.response_type,
      response_mode: environment.response_mode,
      code_challenge_method: environment.code_challenge_method,
      code_challenge: environment.code_challenge,
    };
    logout_url = environment.logout_url;

  constructor( private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
 
  }

  // get authenticated(){
  //   return this.authService.authenticated();
  // }

   onLogin(): void {
     const htmlParams = new HttpParams({fromObject: this.params});
     const codeUrl = this.authorize_uri + htmlParams.toString();
     location.href = codeUrl;

   }

   onLogout(): void {
    location.href = this.logout_url;

   }
  

}
