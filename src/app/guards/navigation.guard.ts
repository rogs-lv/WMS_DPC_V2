import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { CanNavigateService } from '../service/configuration/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationGuard implements CanDeactivate<any> {
  constructor(private canNavigateService: CanNavigateService) { }

  //--------------------------------------------------------------------//
  
  // will prevent user from going back if permission has not been granted
  canDeactivate(component: any) {
  
      let permitted = this.canNavigateService.isPermissionGranted()
      this.canNavigateService.updateNavigationAttempt(permitted)        
  
      if (!permitted) {
          // Push current state again to prevent further attempts.
          history.pushState(null, null, location.href)
          return false
      }
  
      return true
  
  }//canDeactivate

  
}
