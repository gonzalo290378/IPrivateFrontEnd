import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TokenService } from '../users/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const loggedUsername = this.tokenService.getUsernameFromToken();
    const usernameParam = route.paramMap.get('username');

    if (loggedUsername === usernameParam) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
