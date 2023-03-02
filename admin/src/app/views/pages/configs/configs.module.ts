import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Fake API Angular-in-memory
// Translate Module
import {TranslateModule} from '@ngx-translate/core';
import {ConfigsListComponent} from './system-config/configs-list/configs-list.component';
import {ConfigEditComponent} from './system-config/config-edit/config-edit.component';
import {ConfigAddComponent} from './system-config/config-add/config-add.component';
import {InfoFieldsListComponent} from './info-field/info-fields-list/info-fields-list.component';
import {InfoFieldEditComponent} from './info-field/info-field-edit/info-field-edit.component';
import {ConfigDetailComponent} from './system-config/config-detail/config-detail.component';
import {InfoFieldAddComponent} from './info-field/info-field-add/info-field-add.component';
import {PortletModule} from '../../partials/content/general/portlet/portlet.module';
import {SharedModule} from '../../../shared/shared.module';
import {MaterialModule} from '../material/material.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'system/list',
        pathMatch: 'full'
      },
      {
        path: 'system/list',
        component: ConfigsListComponent
      },
      {
        path: 'system/:id/edit',
        component: ConfigEditComponent
      },
      {
        path: 'system/add',
        component: ConfigAddComponent
      },
      {
        path: 'info/list',
        component: InfoFieldsListComponent
      },
      {
        path: 'info/:id/edit',
        component: InfoFieldEditComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    ConfigsListComponent,
    ConfigEditComponent,
    ConfigAddComponent,
    ConfigDetailComponent,
    InfoFieldsListComponent,
    InfoFieldEditComponent,
    InfoFieldAddComponent
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
  exports: [],
  entryComponents: [
    ConfigsListComponent,
    ConfigEditComponent,
    ConfigAddComponent,
    ConfigDetailComponent,
    InfoFieldsListComponent,
    InfoFieldEditComponent,
    InfoFieldAddComponent
  ]
})
export class ConfigsModule {
}
