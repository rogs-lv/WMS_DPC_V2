import { Injectable, ViewChild } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/authentication/auth.service';
import { ComunicationService } from '../service/shared/comunication.service';


@Injectable({
  providedIn: 'root'
})
export class AuthChildRouteGuard implements CanActivateChild {
  
  constructor(private _router:Router,  public authService: AuthService,) {
  }
  
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn !== true) {
      window.alert('Acceso no permitido');
      this._router.navigateByUrl('/login');
    }
    return true;
  }
  
}
