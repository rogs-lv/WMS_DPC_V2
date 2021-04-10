import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListprofileComponent } from './listprofile/listprofile.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

export const PROFILE_ROUTES: Routes = [
    { path: 'list', component: ListprofileComponent },
    { path: 'user', component: UserprofileComponent },
    { path: '**', pathMatch: 'full', redirectTo:'list'},
];
