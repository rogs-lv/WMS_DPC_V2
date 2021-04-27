import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { map } from 'rxjs/operators';
import { response } from 'src/app/interfaces/response.interface';



@Injectable({
    providedIn: 'root'
})
  
export class FolioService {
    endpoint: string = environment.urlApi;
      
    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {
    }

    getCheckFolioFile(fileName: string, userId: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}folio/CheckFolioFile?user=${userId}&file=${fileName}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }

    saveFileFolio(fileName: string, userId: string, arrayBatch: string[]) {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}folio/WriteFileFolio?user=${userId}&fileName=${fileName}`;
        return this.http.post(
          api,
          arrayBatch,
          { headers: header }
        ).pipe(
          map((response: response) => {
            return response;
          })
        );
    }
}