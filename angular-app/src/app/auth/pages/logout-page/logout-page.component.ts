import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../users/services/token.service';

@Component({
  selector: 'app-logout-page',
  imports: [],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.css'
})
export class LogoutPageComponent {

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.tokenService.clear();
    this.router.navigate(['']);
  }
}




