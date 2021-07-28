import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { map } from 'rxjs/operators';
import { response } from 'src/app/interfaces/response.interface';
import { ServiceLayer } from '../shared/ServicesLayer.service';
import { shippingDocument } from 'src/app/models/shipping';


@Injectable({
    providedIn: 'root'
})

export class ShippingService {
    endpoint: string = environment.urlApi;
    endpointSL: string = environment.urlSL;
    constructor(
        private auth: AuthService,
        private SL: ServiceLayer,
        private http: HttpClient
    ){}

    getPartners(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}shipping/GetPartners`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    getBatch(codebars: string, warehouseUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}shipping/BatchNumber?codebars=${codebars}&warehouse=${warehouseUser}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    createInventoryTransferRequest(document: shippingDocument) {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpointSL}InventoryTransferRequests`;
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

    change_stFolio(AbsEntry: number, newStatus: string): Observable<any> {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json');

        const api = `${this.endpointSL}BatchNumberDetails(${AbsEntry})`;
        const body = JSON.stringify({ U_stFolio: newStatus });
        
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