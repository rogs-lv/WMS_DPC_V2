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

export class InventoryService {
    endpoint: string = environment.urlApi;

    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {
    }

    getNumbersRecounts(warehouseUser: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}inventory/NumbersOfRecount?warehouseUser=${warehouseUser}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }

    getLocationsWhsInventory(warehouseCount: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}inventory/LocationsWhsInventory?warehouseCount=${warehouseCount}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }

    getSeeLocation(location: string, warehouseInventory: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}inventory/SeeLocation?location=${location}&warehouseInventory=${warehouseInventory}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }

    getListWarehouseInventory(warehouse: string, typeQuery: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}inventory/WarehouseInventory?warehouse=${warehouse}&typeQuery=${typeQuery}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }

    getAbsEntryUsingBinCode(warehouse: string, bincode: string, type : string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}inventory/AbsEntryFromBinCode?warehouse=${warehouse}&binCode=${bincode}&type=${type}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }

    getAccessColumnQtySAP(userId: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.auth.getToken());
        
        const api = `${this.endpoint}inventory/AccessQuantitySAP?userId=${userId}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }
    getBatch(batch: string, warehouse: string): Observable<any> {
        const header = new HttpHeaders()
        .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}inventory/BatchNumber?codebars=${batch}&warehouse=${warehouse}`;
        return this.http.get(api, { headers: header }).pipe(
          map( (response: response) => {
              return response;
          })
        );
    }

    getCheckInventoryFile(warehouse: string, fileName: string, userId: string): Observable<any> {
        const header = new HttpHeaders()
        .set('Authorization', this.auth.getToken());
    
        const api = `${this.endpoint}inventory/CheckInventoryFile?warehouse=${warehouse}&user=${userId}&file=${fileName}`;
        return this.http.get(api, {headers: header}).pipe(
            map( (response: response) => {
                return response;
            })
        );
    }

    createInventoryFile(warehouse: string, userId: string, fileName: string, stringText: string[]): Observable<any> {
        const header = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.auth.getToken());
        const api = `${this.endpoint}inventory/WriteFileFolio?warehouse=${warehouse}&user=${userId}&fileName=${fileName}`;
        
        return this.http.post(
          api,
          stringText,
          { headers: header }
        ).pipe(
          map((response: response) => {
            return response;
          })
        );
    }
}