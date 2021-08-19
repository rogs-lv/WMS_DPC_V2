import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CanNavigateService {

  private static _isPermissionGranted = false;
  public navigationAttempt = new Subject<boolean>()

  //-------------------------------------------------------------//

  /**Will the next navigation attempt be permitted? */
  updatePermission(isPermissionGranted: boolean) {   
    CanNavigateService._isPermissionGranted = isPermissionGranted
  }//updatePermission

  //-------------------------------------------------------------//

  /**Broadcast the last attempt and whether it was permitted */
  updateNavigationAttempt(wasPermissionGranted: boolean) {    
    this.navigationAttempt.next(wasPermissionGranted)
  }//updatePermission

  //-------------------------------------------------------------//

  /**Can we navigate? */
  public isPermissionGranted(): boolean {
    return CanNavigateService._isPermissionGranted
  }//isPermissionGranted

}//Cls

