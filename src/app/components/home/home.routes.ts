import { RouterModule, Routes } from '@angular/router';
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
import { PROFILE_ROUTES } from '../profiles/profiles.routes';
import { AuthHomeGuard } from 'src/app/guards/auth-home.guard';
import { AdslComponent } from '../adsl/adsl.component';

export const HOME_ROUTES: Routes = [
    { path: 'dashboard', component:  DashboardComponent},
    { path: 'quality', component:  QualityComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'shipping', component:  ShippingComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'shipment', component:  ShipmentComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'inventory', component:  InventoryComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'profiles', component:  ProfilesComponent, canActivate: [ AuthHomeGuard ], children: PROFILE_ROUTES },
    { path: 'folio', component:  FolioComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'manual', component:  ManualComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'move', component:  MoveComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'production', component:  ProduccionComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'receipt', component:  ReceiptComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'request', component:  RequestComponent, canActivate: [ AuthHomeGuard ]},
    { path: 'adsl', component:  AdslComponent, canActivate: [ AuthHomeGuard ]},
    /* { path: 'pagenotfound', component:  PageNotFoundComponent}, */
    { path: '**', pathMatch: 'full', redirectTo:'dashboard'},
];

