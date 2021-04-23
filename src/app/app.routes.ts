import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { HOME_ROUTES } from './components/home/home.routes';
import { AuthGuard } from './guards/auth.guard';
import { AuthChildRouteGuard } from './guards/auth-child-route.guard';

const routes: Routes = [
    { path: 'home', component: HomeComponent, children: HOME_ROUTES, canActivate: [ AuthGuard ], canActivateChild: [AuthChildRouteGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'login' },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
