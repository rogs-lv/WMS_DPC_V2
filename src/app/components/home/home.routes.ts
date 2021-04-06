import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const HOME_ROUTES: Routes = [
    { path: 'dashboard', component:  DashboardComponent},
    { path: '**', pathMatch: 'full', redirectTo:'dashboard'},
];

