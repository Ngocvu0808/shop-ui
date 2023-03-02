import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ModalBasicComponent} from './modal-basic/modal-basic.component';
import {DataFilterPipe} from './data-filter.pipe';
import {StylePaginatorDirective} from './StylePaginatorDirective';
import {SelectCheckAllComponent} from './select-check-all.component';
import {MatCheckboxModule} from '@angular/material';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        HttpClientModule,
        PerfectScrollbarModule,
        MatCheckboxModule,
    ],
    exports: [
        NgbModule,
        HttpClientModule,
        PerfectScrollbarModule,
        ModalBasicComponent,
        DataFilterPipe,
        StylePaginatorDirective,
        SelectCheckAllComponent,
    ],
    declarations: [
        ModalBasicComponent,
        DataFilterPipe,
        StylePaginatorDirective,
        SelectCheckAllComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {
}
