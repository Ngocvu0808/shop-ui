import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './views/theme/base/base.component';
import {ErrorPageComponent} from './views/theme/content/error-page/error-page.component';
import {AuthGuard} from './core/_common/auth/auth.guard';

const routes: Routes = [
    {path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)},

    {
        path: '',
        component: BaseComponent,
        children: [
            {
                path: 'role',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/users/role/role.module').then(m => m.RoleModule)
            },
            {
                path: 'user',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/users/user/user.module').then(m => m.UserModule)
            },
            {
                path: 'group',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/users/group/group.module').then(m => m.GroupModule)
            },
            {
                path: 'application',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/applications/applications.module').then(m => m.ApplicationsModule)
            },
            {
                path: 'service',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/service/services/services.module').then(m => m.ServicesModule)
            },
            {
                path: 'api',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/service/apis/apis.module').then(m => m.ApisModule)
            },
            {
                path: 'api-request',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/service/api-request/api-request.module').then(m => m.ApiRequestModule)
            },
            {
                path: 'config',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/configs/configs.module').then(m => m.ConfigsModule)
            },
            {
                path: 'product',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/shop/product/product.module').then(m => m.ProductModule)
            },
            {
                path: 'business',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/views/pages/shop/business/business.module').then(m => m.BusinessModule)
            },
            {
                path: 'error/403',
                component: ErrorPageComponent,
                data: {
                    type: 'error-v6',
                    code: 403,
                    title: '403... Access forbidden',
                    desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
                }
            },
            {path: 'error/:type', component: ErrorPageComponent},
            {path: '', redirectTo: 'service/list', pathMatch: 'full'},
            {path: '**', redirectTo: 'service/list', pathMatch: 'full'}
        ]
    },

    {path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
