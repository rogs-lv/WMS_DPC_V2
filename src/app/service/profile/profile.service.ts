import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { auth } from '../../interfaces/authenticate.interface';
import { map } from 'rxjs/operators';
import { response } from 'src/app/interfaces/response.interface';


@Injectable({
    providedIn: 'root'
})
  
export class ProfileService {
    endpoint: string = environment.urlApi;
      
    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {
    }
    getListProfiles(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}profile/GetProfiles`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }
    getModulesProfile(idUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}profile/GetAdminModules?IdUser=${idUser}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }
    getAdditionalSettingsProfile(idUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());    
        const api = `${this.endpoint}configuration/GetAdditionalSettings?IdUser=${idUser}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }
}  