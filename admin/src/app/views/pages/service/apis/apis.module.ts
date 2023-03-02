import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../../../shared/shared.module';
import { PartialsModule } from '../../../partials/partials.module';
import { ApiAddComponent } from './api-add/api-add.component';
import { ApiDetailComponent } from './api-detail/api-detail.component';
import { ApisListComponent } from './apis-list/apis-list.component';
import { ApiEditComponent } from './api-edit/api-edit.component';
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
                component: ApisListComponent,
            },
        ]
    }
];

@NgModule({
    declarations: [ApiAddComponent, ApiDetailComponent, ApisListComponent, ApiEditComponent],
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
        ApiAddComponent,
        ApiDetailComponent,
        ApisListComponent,
        ApiEditComponent
    ]
})
export class ApisModule {
}
