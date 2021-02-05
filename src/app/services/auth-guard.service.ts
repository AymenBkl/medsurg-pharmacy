import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService) { }

  async canActivate(): Promise<boolean> {
    await Promise.resolve(this.authService.checkJWT());
    if (this.authService.isAuthenticated) {
      return Promise.resolve(true);
    }
    else {
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }
  }
}
