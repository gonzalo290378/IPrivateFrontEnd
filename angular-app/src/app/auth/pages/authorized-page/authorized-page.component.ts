import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../users/services/auth.service';
import { TokenService } from '../../../users/services/token.service';

@Component({
  selector: 'authorized-page',
  imports: [MaterialModule, RouterModule, FormsModule],
  templateUrl: './authorized-page.component.html',
})
export class AuthorizedComponent implements OnInit {
  code = '';

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
      const code_verifier = this.tokenService.getVerifier();
      this.tokenService.deleteVerifier();
      this.getToken(this.code, code_verifier);
    });
  }

  getToken(code: string, code_verifier: string): void {
    this.authService.getToken(code, code_verifier).subscribe(
      (data) => {
        this.tokenService.setTokens(data.access_token, data.refresh_token);
        console.log(data);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        if (error.status == 409) {
          console.log(error.error);
          Swal.fire('Login error', error.error.message, 'error');
        } else {
          throw error;
        }
      }
    );
  }
}
