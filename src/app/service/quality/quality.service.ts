import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { map } from 'rxjs/operators';
import { response } from 'src/app/interfaces/response.interface';
import { transfer } from 'src/app/models/transfer';
import { ServiceLayer } from '../shared/ServicesLayer.service';


@Injectable({
    providedIn: 'root'
})
  
export class QualityService {
    endpoint: string = environment.urlApi;
    endpointSL: string = environment.urlSL;
      
    constructor(
        private auth: AuthService,
        private SL: ServiceLayer,
        private http: HttpClient
    ) {
    }

    getWarehouseQuality(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}quality/WarehouseQuality?whsCode=${this.auth.getDataToken().WhsCode}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    getBatch(batch: string, status: number): Observable<any> {
        const header = new HttpHeaders()
        .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}quality/BatchNumber?codebars=${batch}&warehouse=${this.auth.getDataToken().WhsCode}&status=${status}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    getDefaultLocation(warehouse: string): Observable<any> {
        const header = new HttpHeaders()
        .set('Authorization', this.auth.getToken());

        const api = `${this.endpoint}quality/DefaultLocationWarehouse?warehouse=${warehouse}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    doReleaseOrLocked(AbsEntry: number, newStatus: string): Observable<any> {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpointSL}BatchNumberDetails(${AbsEntry})`;
        const body = JSON.stringify({ Status: newStatus });
        
        return this.http.patch(
            api,
            body,
            { 
                headers: header,
                withCredentials: true
            },
        ).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    doTransfer(document: transfer): Observable<any> {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpointSL}StockTransfers`;
        return this.http.post(
            api,
            document,
            { 
                headers: header,
                withCredentials: true
            },
        ).pipe(
            map((response: any) => {
                return response;
            })
        );
    }
}  