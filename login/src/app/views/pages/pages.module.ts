// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
// Partials
import {PartialsModule} from '../partials/partials.module';
// Pages
import {CoreModule} from '../../core/core.module';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';
import {HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService} from '../../core/_base/crud';
import {ActionNotificationComponent} from '../partials/content/crud';

@NgModule({
    declarations: [ConfirmDialogComponent,],
    exports: [],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        CoreModule,
        PartialsModule,
        MatTableModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatPaginatorModule,
        MatIconModule
    ],
    providers: [
        InterceptService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptService,
            multi: true
        },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                hasBackdrop: true,
                panelClass: 'kt-mat-dialog-container__wrapper',
                height: 'auto',
                width: 'auto'
            }
        },
        HttpUtilsService,
        TypesUtilsService,
        LayoutUtilsService
    ],
    entryComponents: [
        ConfirmDialogComponent,
        ActionNotificationComponent
    ]
})
export class PagesModule {
}
