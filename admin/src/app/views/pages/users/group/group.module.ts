import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from '../../material/material.module';
import {SharedModule} from '../../../../shared/shared.module';
import {AddUserToGroupComponent} from './add-user-to-group/add-user-to-group.component';
import {PartialsModule} from '../../../partials/partials.module';
import {GroupListComponent} from './group-list/group-list.component';
import {GroupAddComponent} from './group-add/group-add.component';
import {GroupDetailComponent} from './group-detail/group-detail.component';
import {GroupEditComponent} from './group-edit/group-edit.component';

const routes: Routes = [
  {
    path: '',
    // component: UsersListComponent,
    // canActivate: [ModuleGuard],
    // data: { moduleName: 'settting' },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: GroupListComponent,
      },
      {
        path: ':id',
        component: GroupDetailComponent,
      },
      {
        path: ':id/edit',
        component: GroupEditComponent
      },
      {
        path: 'add',
        component: GroupAddComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    GroupListComponent,
    GroupAddComponent,
    GroupDetailComponent,
    GroupEditComponent,
    AddUserToGroupComponent],
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
    GroupListComponent,
    GroupAddComponent,
    GroupDetailComponent,
    GroupEditComponent,
    AddUserToGroupComponent,
  ]
})
export class GroupModule {
}
