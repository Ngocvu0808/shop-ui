import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../../../shared/shared.module';
import { PartialsModule } from '../../../partials/partials.module';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServiceAddComponent } from './service-add/service-add.component';
import { ServiceEditComponent } from './service-edit/service-edit.component';
import { NgZorroAntdModule } from '../../../../ng-zorro-antd.module';
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
                component: ServicesListComponent,
            },
        ]
    }
];

@NgModule({
    declarations: [ServicesListComponent, ServiceAddComponent, ServiceEditComponent],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        PartialsModule,
        NgZorroAntdModule
    ],
    exports: [],
    entryComponents: [
        ServicesListComponent,
        ServiceAddComponent,
        ServiceEditComponent
    ]
})
export class ServicesModule {
}
