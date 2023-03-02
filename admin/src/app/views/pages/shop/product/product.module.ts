import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {PartialsModule} from '../../../partials/partials.module';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProductAddComponent} from './product-add/product-add.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: ProductListComponent,
            },
            {
                path: ':id',
                component: ProductDetailComponent,
            },
            {
                path: ':id/edit',
                component: ProductEditComponent
            },
            {
                path: 'add',
                component: ProductAddComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductAddComponent,
        ProductEditComponent,
        ProductDetailComponent,
        ProductListComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        PartialsModule
    ],
    exports: [],
    entryComponents: [
        ProductAddComponent,
        ProductEditComponent,
        ProductDetailComponent,
        ProductListComponent
    ]
})
export class ProductModule {
}
