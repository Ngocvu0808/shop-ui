import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {PageEvent} from '@angular/material/paginator';
import {MatDialog, MatSnackBar, Sort} from '@angular/material';
import {saveAs} from 'file-saver';

import {NotifyService} from '../../../../../service/notify.service';
import {ApplicationService} from '../../../../../service/application.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {ApiHelperService} from '../../../../../core/_common/apiHelper.service';
import {LogHistoryDetailComponent} from '../log-history-detail/log-history-detail.component';

@Component({
    selector: 'mar-logs-history-list',
    templateUrl: './logs-history-list.component.html',
    styleUrls: ['./logs-history-list.component.scss']
})
export class LogsHistoryListComponent implements OnInit, OnChanges {
    displayedColumns: string[] = ['token', 'apiUrl', 'method', 'nameUser', 'ip', 'resTime', 'createdTime', 'status', 'actions'];
    dataSource = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    filterText: any = '';
    status: any = '';
    searchValue: string = '';
    // sort
    sortActive = '';
    sortDirection = '';
    appId: any = 0;

    fromDate: any;
    toDate: any;
    minDate: Date;
    today: number = 0;
    fromDateInvalid = false;
    toDateInvalid = false;
    fromDateInvalidMsg = '';
    toDateInvalidMsg = '';
    statusValue: any;
    filterStatus: Array<any> = [];
    allLabel: any;

    @Input() isActiveTab: number;
    loading: any;

    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
                private translate: TranslateService,
                private appService: ApplicationService,
                public cdr: ChangeDetectorRef,
                private notifyService: NotifyService,
                private route: ActivatedRoute,
                private permissionService: PermissionService,
                private api: ApiHelperService,
                private datePipe: DatePipe,
    ) {
        this.minDate = new Date(1900, 0, 1);
        this.fromDate = new Date();
        this.toDate = new Date();
        this.appId = this.route.snapshot.paramMap.get('id');
        this.allLabel = 'Tất cả';
        this.statusValue = '';
    }

    ngOnChanges() {
        if (this.isActiveTab == 4) {
            this.getStatusFilter();
            this.fetchData();
        }
    }

    ngOnInit() {
    }

    getStatusFilter() {
        this.appService.getRequestStatus().subscribe(res => {
            if (res && res.status) {
                this.filterStatus = res.data;
                this.cdr.markForCheck();
            }
        });
    }

    search() {
        this.getAll(1, this.limit);
    }

    fetchData() {
        this.getAll(this.page + 1, this.limit);
    }

    getAll(page: number, limit: number) {
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        if (this.checkPermission(PERMISSION_CODE.USER.DEVELOPER) || this.checkPermission(PERMISSION_CODE.APPLICATION.CLIENT_GET_LIST_REQUEST_LOG)) {
            return;
        }
        let fromDateValue = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd').concat(' 00:00:00.000');
        let toDateValue = this.datePipe.transform(this.toDate, 'yyyy-MM-dd').concat(' 23:59:59.999');
        const req = {
            toDate: this.today == this.toDate.getDate() ? '' : new Date(toDateValue).getTime(),
            fromDate: new Date(fromDateValue).getTime(),
            status: this.statusValue,
            search: this.searchValue,
            page: page,
            limit: limit,
            sort: sortValue,
        };
        this.loading = true;
        this.appService.getAllLog(this.appId, req).subscribe(res => {
            if (res) {
                if (res.status) {
                    this.dataSource = res.data.list;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    this.loading = false;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    detail(element: any) {
        element['appId'] = this.appId;
        const dialogRef = this.dialog.open(LogHistoryDetailComponent, {data: {element}});
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    checkValidFromDate(fromDate) {
        if (fromDate != null && fromDate != '') {
            if (new Date(fromDate).getTime() > new Date().getTime()) {
                return false;
            }
        }
        return true;
    }

    checkValidToDate(fromDate, toDate) {
        if (toDate != null && toDate != '') {
            if (new Date(toDate).getTime() > new Date().getTime()) {
                return false;
            }
            if (fromDate != null) {
                if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
                    return false;
                }
            }
        }
        return true;
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'Success':
                return 'status-active';
            case 'Internal Server Error':
                return 'status-expired';
            case 'Bad request':
            case 'Forbidden':
            case 'Not Found':
            case 'Conflict':
            case 'Un authorized':
                return 'status-deactive';
        }
        return '';
    }

    exportFile() {
        if (this.checkPermission(PERMISSION_CODE.USER.DEVELOPER) || this.checkPermission(PERMISSION_CODE.APPLICATION.CLIENT_EXPORT_REQUEST_LOG)) {
            return;
        }
        let fromDateValue = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd').concat(' 00:00:00.000');
        let toDateValue = this.datePipe.transform(this.toDate, 'yyyy-MM-dd').concat(' 23:59:59.999');
        const req = {
            toDate: this.today == this.toDate.getDate() ? '' : new Date(toDateValue).getTime(),
            fromDate: new Date(fromDateValue).getTime(),
        };
        try {
            this.appService.exportLog(this.appId, req).subscribe(res => {
                const blob = new Blob([res], {type: 'text/csv;charset=UTF-8'});
                const fileName = `${this.datePipe.transform(this.fromDate, 'dd-MM-yyyy')}_${this.datePipe.transform(this.toDate, 'dd-MM-yyyy')}`;
                saveAs(blob, `request-logs_${fileName}.csv`);
            });
        } catch (e) {
            console.log(e);
        }
    }

    onPageChange(event: PageEvent) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.fetchData();
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    validateFromDate(type, event) {
        if (event.targetElement.value == '') {
            this.fromDateInvalid = false;
            return;
        }
        if (event.value == null) {
            this.fromDateInvalid = true;
            this.fromDateInvalidMsg = this.translate.instant('APP.LOG_HISTORY.DATE_INVALID');
            this.cdr.markForCheck();
            return;
        }
        this.fromDateInvalid = false;
    }

    validateToDate(type, event) {
        if (event.targetElement.value == '') {
            this.toDateInvalid = false;
            return;
        }
        if (event.value == null) {
            this.toDateInvalid = true;
            this.toDateInvalidMsg = this.translate.instant('APP.LOG_HISTORY.DATE_INVALID');
            this.cdr.markForCheck();
            return;
        }
        this.fetchData();
        this.toDateInvalid = false;
    }

    getMsgValidateFromDate(fromDate) {
        if (fromDate != null && fromDate != '') {
            if (new Date(fromDate).getTime() > new Date().getTime()) {
                return this.translate.instant('APP.LOG_HISTORY.FROM_DATE_GT_CURRENT_DATE');
            }
        }
        return '';
    }

    getMsgValidateToDate(fromDate, toDate) {
        if (toDate != null && toDate != '') {
            if (new Date(toDate).getTime() > new Date().getTime()) {
                return this.translate.instant('APP.LOG_HISTORY.TO_DATE_GT_CURRENT_DATE');
            }
            if (fromDate != null) {
                if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
                    return this.translate.instant('APP.LOG_HISTORY.TO_DATE_GT_FROM_DATE');
                }
            }
        }
        return '';
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

}
