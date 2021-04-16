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
  
export class ConfigurationService {
    endpoint: string = environment.urlApi;
      
    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {
    }

    getConfigurationProfile(idUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}Configuration/GetModules?IdUser=${idUser}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }
}  