import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { response } from 'src/app/interfaces/response.interface';


@Injectable({
    providedIn: 'root'
})
  
export class ServiceLayer {
    endpoint: string = environment.urlSL;
    credential = environment.credentials;
    
    constructor(
        private http: HttpClient
    ) {
    }

    doLoginSL(): Observable<any>{
        const credentials = JSON.stringify({ UserName: this.credential.UserName, Password: this.credential.Password, CompanyDB: this.credential.CompanyDB});

        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpoint}Login`;
        return this.http.post(
            api,
            credentials,
            { 
                headers: header,
                withCredentials: true
            },
        ).pipe(
            map((response: any) => {
                Object.assign(response, { "expirate" : new Date(new Date().getTime() + response.SessionTimeout*60000).getTime()});
                localStorage.setItem('SessionId', JSON.stringify(response));
                return response;
            })
        );
    }

    doLogoutSL() {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpoint}Logout`;
        return this.http.post(
            api,
            { 
                headers: header,
            },
        ).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    deleteSession() {
        localStorage.removeItem('SessionId');
    }

    sessionIsValid() {
        const dateSystem = new Date().getTime();
        const session = localStorage.getItem('SessionId');
        if(session !== null) {
            const expirateSession = JSON.parse(session).expirate;
            if(expirateSession > dateSystem) {
                return true;
            }
            else {
                return false;
            }
        } else
            return false;
    }

    getSessionId() {
        const session = JSON.parse(localStorage.getItem('SessionId'));
        return session;
    }
}