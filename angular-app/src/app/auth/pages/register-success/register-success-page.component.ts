import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-page',
  imports: [],
  templateUrl: './register-success-page.component.html',
  styleUrl: './register-success-page.component.css',
})
export class RegisterSuccessPageComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
