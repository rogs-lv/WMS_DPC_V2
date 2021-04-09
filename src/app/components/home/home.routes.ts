import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { QualityComponent } from '../quality/quality.component';
import { ShippingComponent } from '../shipping/shipping.component';
import { ShipmentComponent } from '../shipment/shipment.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { ProfilesComponent } from '../profiles/profiles.component';
import { FolioComponent } from '../folio/folio.component';
import { ManualComponent } from '../transfer/manual/manual.component';
import { MoveComponent } from '../transfer/move/move.component';
import { ProduccionComponent } from '../transfer/produccion/produccion.component';
import { ReceiptComponent } from '../transfer/receipt/receipt.component';
import { RequestComponent } from '../transfer/request/request.component';

export const HOME_ROUTES: Routes = [
    { path: 'dashboard', component:  DashboardComponent},
    { path: 'quality', component:  QualityComponent},
    { path: 'shipping', component:  ShippingComponent},
    { path: 'shipment', component:  ShipmentComponent},
    { path: 'inventory', component:  InventoryComponent},
    { path: 'profiles', component:  ProfilesComponent},
    { path: 'folio', component:  FolioComponent},
    { path: 'manual', component:  ManualComponent},
    { path: 'move', component:  MoveComponent},
    { path: 'production', component:  ProduccionComponent},
    { path: 'receipt', component:  ReceiptComponent},
    { path: 'request', component:  RequestComponent},
    { path: '**', pathMatch: 'full', redirectTo:'dashboard'},
];

