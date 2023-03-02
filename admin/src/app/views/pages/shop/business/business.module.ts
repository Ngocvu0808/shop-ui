import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {PartialsModule} from '../../../partials/partials.module';
import { SellingComponent } from './trading/selling/selling.component';
import { BusinessReportComponent } from './report/business-report/business-report.component';
import { TradingListComponent } from './trading/trading-list/trading-list.component';
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'business',
                pathMatch: 'full'
            },
            {
                path: 'sell',
                component: SellingComponent,
            },
            {
                path: 'business',
                component: BusinessReportComponent
            },
            {
                path: 'trading',
                component: TradingListComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        SellingComponent,
        BusinessReportComponent,
        TradingListComponent,
    ],
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
        SellingComponent,
        BusinessReportComponent,
        TradingListComponent
    ]
})
export class BusinessModule {
}
