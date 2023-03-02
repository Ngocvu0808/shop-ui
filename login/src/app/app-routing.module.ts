// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
// Auth

const routes: Routes = [
    {path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)},
    {path: '', redirectTo: 'auth/checkLogin', pathMatch: 'full'},
    {path: '**', redirectTo: 'auth/checkLogin', pathMatch: 'full'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
