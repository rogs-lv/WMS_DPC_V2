import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { moduleHome } from 'src/app/models/module';
import { profile } from 'src/app/models/profile';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {

  private idProfileService = new BehaviorSubject<profile>(null);
  sharedIdProfileObservable = this.idProfileService.asObservable();

  private pathsService = new BehaviorSubject<moduleHome[]>(null);
  sharedPathsObservable = this.idProfileService.asObservable();

  constructor() { }

  enviarMensaje(idProfile: profile) {
    this.idProfileService.next(idProfile);
  }

  enviarPaths(path: moduleHome[]){
    this.pathsService.next(path);
  }
}
