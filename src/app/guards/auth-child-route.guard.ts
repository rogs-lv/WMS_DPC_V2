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
   /*  console.log(next.url[0].path);
    const module = this.auth.verifyRouteUser(next.url[0].path);
    console.log(module);
    if(module.length === 0) { // encontro
      return true;
    } else { // no encontrado lo redireccionamos al primer modulo
      alert("No tiene permiso para acceder a este modulo");
      this._router.navigateByUrl(`/home/${module[0].path}`);
      return false;
    } */
  }
  
}
