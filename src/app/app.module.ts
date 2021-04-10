import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app.routes';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QualityComponent } from './components/quality/quality.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { ShipmentComponent } from './components/shipment/shipment.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { FolioComponent } from './components/folio/folio.component';

import { AgGridModule } from 'ag-grid-angular';
import { ManualComponent } from './components/transfer/manual/manual.component';
import { MoveComponent } from './components/transfer/move/move.component';
import { ProduccionComponent } from './components/transfer/produccion/produccion.component';
import { ReceiptComponent } from './components/transfer/receipt/receipt.component';
import { RequestComponent } from './components/transfer/request/request.component';
import { ListprofileComponent } from './components/profiles/listprofile/listprofile.component';
import { UserprofileComponent } from './components/profiles/userprofile/userprofile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    QualityComponent,
    ShippingComponent,
    ShipmentComponent,
    InventoryComponent,
    ProfilesComponent,
    FolioComponent,
    ManualComponent,
    MoveComponent,
    ProduccionComponent,
    ReceiptComponent,
    RequestComponent,
    ListprofileComponent,
    UserprofileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
