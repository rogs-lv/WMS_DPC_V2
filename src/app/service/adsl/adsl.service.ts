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
export class ADSLService {
    endpoint: string = environment.urlApi;
    endpointSL: string = environment.urlSL;

    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {
    }

    getListPartners(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}ADSL/GetBussinesPartner`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    getBatch(codebars: string, warehouseUser: string, priceList: number): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}ADSL/GetBatch?codebars=${codebars}&warehouse=${warehouseUser}&priceList=${priceList}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    processData(data: any, cardcode: string, usuario: string): Observable<any> {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}ADSL/ProcessDelivery?cardCode=${cardcode}&usuario=${usuario}`;
        return this.http.post(
            api,
            data,
            { 
                headers: header
            },
        ).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    createDelivery(document: any) {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpointSL}DeliveryNotes`;
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

    updateBatchDelivery(AbsEntryBatch: number, dateOut: string, timeOut: string): Observable<any> {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpointSL}BatchNumberDetails(${AbsEntryBatch})`;
        const body = JSON.stringify(
            { 
                U_DateOut: dateOut,//YYYY-MM-DD
                U_TimeOut: timeOut,
            }
        );
        
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

}