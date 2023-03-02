import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Translate Module
import {TranslateModule} from '@ngx-translate/core';
import {PortletModule} from 'app/views/partials/content/general/portlet/portlet.module';
import {SharedModule} from 'app/shared/shared.module';
import {RolesListComponent} from './roles-list/roles-list.component';
import {MaterialModule} from '../../material/material.module';
import {RoleDetailComponent} from './role-detail/role-detail.component';
import {RoleEditComponent} from './role-edit/role-edit.component';
import {RoleAddComponent} from './role-add/role-add.component';

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
                component: RolesListComponent
            },
        ]
    }
];

@NgModule({
    declarations: [
        RolesListComponent,
        RoleEditComponent,
        RoleAddComponent,
        RoleDetailComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes),
        PortletModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule
    ],
    exports: [
        RolesListComponent,
        RoleEditComponent,
        RoleAddComponent,
        RoleDetailComponent],
    entryComponents: [
        RolesListComponent,
        RoleEditComponent,
        RoleAddComponent,
        RoleDetailComponent
    ]
})
export class RoleModule {
}
