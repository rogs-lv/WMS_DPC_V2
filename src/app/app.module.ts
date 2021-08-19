import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { ReadComponent } from './components/shared/read/read.component';
import { SnakbarComponent } from './components/shared/snakbar/snakbar.component';
import { FilterModulePipe } from './pipes/filter-module.pipe';
import { FilterSubmodulePipe } from './pipes/filter-submodule.pipe';
import { FilterTableUsersPipe } from './pipes/filter-table-users.pipe';
import { DialogConfirmComponent } from './components/shared/dialog-confirm/dialog-confirm.component';
import { LocationBatchComponent } from './components/inventory/dialog/location-batch/location-batch.component';
import { ChangeWhsComponent } from './components/inventory/dialog/change-whs/change-whs.component';
import { DialogLocationComponent } from './components/transfer/dialog/dialog-location/dialog-location.component';
import { SuggestedComponent } from './components/transfer/dialog/suggested/suggested.component';
import { OpenRequestComponent } from './components/transfer/dialog/open-request/open-request.component';
import { MultibatchComponent } from './components/transfer/dialog/multibatch/multibatch.component';
import { AdslComponent } from './components/adsl/adsl.component';
import { ReplacePipe } from './pipes/replace.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
//import { CanNavigateService } from './service/configuration/navigation.service';

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
    UserprofileComponent,
    ReadComponent,
    SnakbarComponent,
    FilterModulePipe,
    FilterSubmodulePipe,
    FilterTableUsersPipe,
    DialogConfirmComponent,
    LocationBatchComponent,
    ChangeWhsComponent,
    DialogLocationComponent,
    SuggestedComponent,
    OpenRequestComponent,
    MultibatchComponent,
    AdslComponent,
    ReplacePipe,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [FolioComponent, DialogConfirmComponent, InventoryComponent, LocationBatchComponent, ChangeWhsComponent, DialogLocationComponent, MoveComponent, SuggestedComponent, RequestComponent, OpenRequestComponent, ManualComponent, MultibatchComponent],
  //providers: [CanNavigateService],
  providers:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
