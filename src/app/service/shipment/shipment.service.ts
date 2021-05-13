import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { map } from 'rxjs/operators';
import { response } from 'src/app/interfaces/response.interface';
import { ServiceLayer } from '../shared/ServicesLayer.service';
import { shippingDocument } from 'src/app/models/shipping';
import { shipmentProcess } from 'src/app/models/shipment';
import { transferShipment } from 'src/app/models/transfer';

@Injectable({
    providedIn: 'root'
})

export class ShipmentService {
    endpoint: string = environment.urlApi;
    endpointSL: string = environment.urlSL;
    constructor(
        private auth: AuthService,
        private SL: ServiceLayer,
        private http: HttpClient
    ){}

    getListClients(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}shipment/GetClients`;
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

    getDocumentShipment(docnum: number): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}shipment/GetNumberShipment?docnum=${docnum}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    applyGR(batch: string) {
        const header = new HttpHeaders()
        .set('Authorization', this.auth.getToken());
    
        const api = `${this.endpoint}shipment/ApplyGR?batch=${batch}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    validEFEEM(batch: string, event: number) {
        const header = new HttpHeaders()
        .set('Authorization', this.auth.getToken());
    
        const api = `${this.endpoint}shipment/ValidateEFEEM?batch=${batch}&type=${event}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    processShipmentEFFEM(data: shipmentProcess[]) {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.auth.getToken());

        const api = `${this.endpoint}shipment/ProcessShipment`;
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

    updateBatchs(batchs: string[], status: string, docnum: number, docentry: number) {
        const header = new HttpHeaders()
        .set('Authorization', this.auth.getToken())
        .set('Content-Type', 'application/json');
    
        const api = `${this.endpoint}shipment/UpdateBatchs?status=${status}&docnum=${docnum}&docentry=${docentry}`;
        return this.http.put(
            api,
            batchs,
            { 
                headers: header 
            }
        ).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    createRequestShipment(document: shippingDocument) {
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
    
    createTransfer(document: transferShipment): Observable<any> {
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