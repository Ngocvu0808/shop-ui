import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../../../shared/shared.module';
import { PartialsModule } from '../../../partials/partials.module';
import { ApiRequestsListComponent } from './api-requests-list/api-requests-list.component';
import { ApiRequestDetailComponent } from './api-request-detail/api-request-detail.component';
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
                component: ApiRequestsListComponent,
            },
        ]
    }
];

@NgModule({
    declarations: [ApiRequestsListComponent, ApiRequestDetailComponent],
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
        ApiRequestsListComponent,
        ApiRequestDetailComponent
    ]
})
export class ApiRequestModule {
}
