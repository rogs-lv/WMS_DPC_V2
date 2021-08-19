import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HOME_ROUTES } from '../components/home/home.routes';
import { AuthService } from '../service/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHomeGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private _router:Router,
    
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.verifyPath(next.url[0].path).pipe(
          // Si la petición es exitosa se puede proceder
          map(result => {
            if(result !== null){
              if(result.IdModule === "" && result.Path === "pagenotfound") {
                alert(`No tiene acceso a la url solicitada`);
                this._router.navigateByUrl('/home');
                return false;
              }
              return true;
            }
            else{
              return false;
            }
          })
      );
  }
  
}
