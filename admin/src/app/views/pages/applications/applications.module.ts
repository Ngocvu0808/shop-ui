import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppListComponent} from './app-list/app-list.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Translate Module
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from '../material/material.module';
import {SharedModule} from '../../../shared/shared.module';
import {PartialsModule} from '../../partials/partials.module';
import {CdkTableModule} from '@angular/cdk/table';
import {AppAddComponent} from './app-add/app-add.component';
import {AppDetailComponent} from './app-detail/app-detail.component';
import {AppGetApiKeyComponent} from './app-get-api-key/app-get-api-key.component';
import {AppEditComponent} from './app-edit/app-edit.component';
import {UsersListComponent} from './user/users-list/users-list.component';
import {UserAddComponent} from './user/user-add/user-add.component';
import {UserEditComponent} from './user/user-edit/user-edit.component';
import {AccessTokensListComponent} from './access-token/access-tokens-list/access-tokens-list.component';
import {LogsHistoryListComponent} from './log-history/logs-history-list/logs-history-list.component';
import {LogHistoryDetailComponent} from './log-history/log-history-detail/log-history-detail.component';
import {ServicesListComponent} from './service/services-list/services-list.component';
import {ServiceAddComponent} from './service/service-add/service-add.component';
import {ServiceRegisterComponent} from './service/service-register/service-register.component';
import {NgZorroAntdModule} from '../../../ng-zorro-antd.module';
import { ApiKeyComponent } from './api-key/api-key.component';
import { RefreshTokenComponent } from './refresh-token/refresh-token.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'app',
                pathMatch: 'full'
            },
            {
                path: 'app',
                component: AppListComponent,
            },
            {
                path: 'app/:id',
                component: AppDetailComponent
            },
        ]
    }
];


@NgModule({
    declarations: [
        AppListComponent,
        AppAddComponent,
        AppDetailComponent,
        AppGetApiKeyComponent,
        AppEditComponent,
        UsersListComponent,
        UserAddComponent,
        UserEditComponent,
        AccessTokensListComponent,
        LogsHistoryListComponent,
        LogHistoryDetailComponent,
        ServicesListComponent,
        ServiceAddComponent,
        ServiceRegisterComponent,
        ApiKeyComponent,
        RefreshTokenComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        PartialsModule,
        CdkTableModule,
        NgZorroAntdModule

    ],
    entryComponents: [
        AppListComponent,
        AppAddComponent,
        AppDetailComponent,
        AppGetApiKeyComponent,
        AppEditComponent,
        UserAddComponent,
        UserEditComponent,
        LogHistoryDetailComponent,
        ServiceAddComponent,
        ServiceRegisterComponent,
        ApiKeyComponent
    ],
})
export class ApplicationsModule {
}
