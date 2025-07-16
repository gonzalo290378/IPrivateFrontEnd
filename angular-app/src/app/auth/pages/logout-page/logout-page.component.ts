import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-page',
  imports: [],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.css',
})
export class LogoutPageComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['']);
  }
}
