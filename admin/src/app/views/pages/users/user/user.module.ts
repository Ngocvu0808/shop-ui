import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Fake API Angular-in-memory
// Translate Module
import {TranslateModule} from '@ngx-translate/core';
import {UsersListComponent} from './users-list/users-list.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserAddComponent} from './user-add/user-add.component';
import {MaterialModule} from '../../material/material.module';
import {SharedModule} from '../../../../shared/shared.module';
import {PartialsModule} from '../../../partials/partials.module';
import {UserChangePasswordComponent} from './user-change-password/user-change-password.component';
import {TokensListComponent} from './tokens-list/tokens-list.component';

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
        component: UsersListComponent,
      },
      {
        path: ':id',
        component: UserDetailComponent,
      },
      {
        path: ':id/edit',
        component: UserEditComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    UsersListComponent,
    UserEditComponent,
    UserDetailComponent,
    UserAddComponent,
    UserChangePasswordComponent,
    TokensListComponent],
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
    UsersListComponent,
    UserEditComponent,
    UserDetailComponent,
    UserAddComponent,
    UserChangePasswordComponent,
    TokensListComponent
  ]
})
export class UserModule {
}
