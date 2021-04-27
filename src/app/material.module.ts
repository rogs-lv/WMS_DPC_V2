import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav'; 
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule, MatExpansionModule } from '@angular/material';
import {MatMenuModule} from '@angular/material/menu'; 
import {MatCardModule} from '@angular/material/card'; 
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
    declarations: [],
    imports: [ 
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatExpansionModule,
        MatMenuModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatExpansionModule, 
        MatMenuModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    providers: [],
})
export class MaterialModule {}