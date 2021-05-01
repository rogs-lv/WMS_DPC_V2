import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { map } from 'rxjs/operators';
import { response } from 'src/app/interfaces/response.interface';
import { ServiceLayer } from '../shared/ServicesLayer.service';
import { warehouse } from 'src/app/models/warehouse';
import { transfer } from 'src/app/models/transfer';


@Injectable({
    providedIn: 'root'
})

export class TransferService {
    endpoint: string = environment.urlApi;
    endpointSL: string = environment.urlSL;
      
    constructor(
        private auth: AuthService,
        private SL: ServiceLayer,
        private http: HttpClient
    ) {
    }
    
    viewLocation(location: string, warehouseUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}transfer/ViewLocation?location=${location}&warehouseTransfer=${warehouseUser}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    suggestedLocation(warehouseUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}transfer/SuggestedLocation?warehouseUser=${warehouseUser}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    locationByBinCode(warehouseUser: string, bincode: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}transfer/GetLocation?warehouse=${warehouseUser}&binCode=${bincode}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    getBatch(codebars: string, warehouseUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}transfer/BatchNumber?codebars=${codebars}&warehouse=${warehouseUser}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    createTransfer(document: transfer): Observable<any> {
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