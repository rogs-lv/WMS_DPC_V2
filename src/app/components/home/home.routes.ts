import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { QualityComponent } from '../quality/quality.component';
import { ShippingComponent } from '../shipping/shipping.component';
import { ShipmentComponent } from '../shipment/shipment.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { ProfilesComponent } from '../profiles/profiles.component';
import { FolioComponent } from '../folio/folio.component';

export const HOME_ROUTES: Routes = [
    { path: 'dashboard', component:  DashboardComponent},
    { path: 'quality', component:  QualityComponent},
    { path: 'shipping', component:  ShippingComponent},
    { path: 'shipment', component:  ShipmentComponent},
    { path: 'inventory', component:  InventoryComponent},
    { path: 'profiles', component:  ProfilesComponent},
    { path: 'folio', component:  FolioComponent},
    { path: '**', pathMatch: 'full', redirectTo:'dashboard'},
];

