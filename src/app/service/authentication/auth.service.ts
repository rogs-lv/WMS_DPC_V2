import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { user } from 'src/app/models/user';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { response } from 'src/app/interfaces/response.interface';
import { module, moduleHome } from 'src/app/models/module';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint: string = environment.urlApi;
  currentUser = {};
  /* modulesHome: moduleHome[]; */

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    /* this.modulesHome = []; */
  }

  // Sign-in
  signIn(user: user) {
    const headersLogin = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
    .set('Username', user.Username)
    .set('Password', user.Password);

    return this.http.post(
      `${this.endpoint}authentication/login`,
      body, { headers: headersLogin }
    ).pipe(
      map( (response: response) => {
        localStorage.setItem('access_token', response.Data.Token);
        return response;
      })
    );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getDataToken(): any {
    return jwt_decode(this.getToken());
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('lastOnePage');
  }

  // User profile
  getUserProfile(id): Observable<any> {
    const headersProf = new HttpHeaders()
    .set('Authorization', this.getToken());
    const api = `${this.endpoint}wms/Configuration/GetModules?IdUser=${id}`;
    return this.http.get(api, { headers: headersProf }).pipe(
      map( (response: Response) => {
          return response;
      })
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  verifyPath(path: string): Observable<module> {
    const header = new HttpHeaders()
        .set('Authorization', this.getToken());
    const api = `${this.endpoint}Configuration/GetVerifypath?userId=${this.getDataToken().IdUser}&path=${path}`;
    return this.http.get(api, { headers: header }).pipe(
      map( (response: any) => {
          return response.Data;
      })
    );
  }
}
