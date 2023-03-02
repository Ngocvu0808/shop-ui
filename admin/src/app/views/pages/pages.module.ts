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
import {MatExpansionModule} from '@angular/material/expansion';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent
} from '../partials/content/crud';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';
import {HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService} from '../../core/_base/crud';
import {RoleModule} from './users/role/role.module';
import {UserModule} from './users/user/user.module';
import {GroupModule} from './users/group/group.module';
import {ProductModule} from './shop/product/product.module';
import {BusinessModule} from './shop/business/business.module';

@NgModule({
    declarations: [ConfirmDialogComponent],
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
        MatIconModule,
        MatExpansionModule,
        RoleModule,
        UserModule,
        GroupModule,
        ProductModule,
        BusinessModule,
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
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent
    ]
})
export class PagesModule {
}
