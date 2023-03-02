import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { NotifyService } from '../../../../../service/notify.service';
import { PermissionService } from '../../../../../core/_common/permission.service';
import { ApiRequestDetailComponent } from '../api-request-detail/api-request-detail.component';
import { HelperService } from '../../../../../core/_common/helper/helper.service';
import { PERMISSION_CODE } from '../../../../../core/_common/config/permissionCode';
import { ServiceService } from '../../../../../service/service.service';

@Component({
    selector: 'mar-api-requests-list',
    templateUrl: './api-requests-list.component.html',
    styleUrls: ['./api-requests-list.component.scss']
})
export class ApiRequestsListComponent implements OnInit {

    displayedColumns: string[] = ['api', 'method', 'system', 'service', 'type', 'application', 'user', 'timeRequest', 'status', 'actions'];
    dataSource: Array<any> = [];

    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    searchValue: any = '';

    // filter
    systemFilterList: Array<any> = [];
    serviceList: Array<any> = [];
    serviceFilterList: Array<any> = [];
    statusFilterList: Array<any> = [];
    typeFilterList: Array<any> = [];

    systemValue: any = '';
    statusValue: any = '';
    serviceValue: any = '';
    typeValue: any = '';


    allLabel: any = '';
    // sort
    sortActive = '';
    sortDirection = '';
    canAccess: boolean = true;
    loading: any;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private serviceService: ServiceService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private notifyService: NotifyService,
        private permissionService: PermissionService,
        private helperService: HelperService
    ) {
    }

    ngOnInit() {
        this.initFilterData();
        this.getSystems();
        this.getServices();
        this.getStatus();
        this.getTypes();
        this.fetchData();
    }

    initFilterData() {
        this.allLabel = 'Tất cả';
        this.systemValue = '';
        this.serviceValue = '';
        this.statusValue = '';
        this.typeValue = '';
    }

    getSystems() {
        this.serviceService.getSystems().subscribe(res => {
            if (res && res.status) {
                this.systemFilterList = res.data;
                this.cdr.markForCheck();
            }
        });
    }

    getServices() {
        this.serviceService.getAllServiceNoPaging().subscribe(res => {
            if (res && res.status) {
                this.serviceList = res.data;
                this.serviceFilterList = this.serviceList;
                this.cdr.markForCheck();
            }
        });
    }

    getStatus() {
        this.serviceService.getListStatusApiRequest().subscribe(res => {
            if (res && res.status) {
                this.statusFilterList = res.data.map(it => it.name);
                this.cdr.markForCheck();
            }
        });
    }

    getTypes() {
        this.serviceService.getListTypeApi().subscribe(res => {
            if (res && res.status) {
                this.typeFilterList = res.data.map(it => it.name);
                this.cdr.markForCheck();
            }
        });
    }

    onSystemFilterChange() {
        if (this.systemValue == '') {
            this.serviceFilterList = this.serviceList;
        } else {
            this.serviceFilterList = this.serviceList.filter(it => this.systemValue == it.systemId);
        }
        this.cdr.markForCheck();
        this.search();
    }

    fetchData() {
        this.getAll(this.page + 1, this.limit);
    }

    search() {
        this.page = 0;
        this.fetchData();
    }

    getAll(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_REQUEST_GET_ALL)) {
            return;
        }
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const req = {
            page: page,
            limit: limit,
            status: this.statusValue,
            types: this.typeValue,
            serviceIds: this.serviceValue,
            systemIds: this.systemValue,
            clientIds: '',
            search: this.searchValue,
            sort: sortValue
        };
        this.loading = true;
        this.serviceService.getAllApiRequest(req).subscribe(res => {
            if (res) {
                if (res.status) {
                    const data = res.data.list;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    data.forEach((it) => {
                        it['actions'] = '';
                    });
                    this.dataSource = data;
                    this.loading = false;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    changeStatusRequest(item: any, status: string): void {
        const title = this.translate.instant('API_REQUEST.UPDATE_STATUS.TITLE');
        const message = status == 'REJECTED' ? this.translate.instant('API_REQUEST.UPDATE_STATUS.CONFIRM_REJECT') + item.api : this.translate.instant('API_REQUEST.UPDATE_STATUS.CONFIRM_APPROVE') + item.api;
        const yes = this.translate.instant('COMMON.BTN_CONFIRM');
        const no = this.translate.instant('COMMON.BTN_CANCEL');
        const dialogData = new ConfirmDialogModel(title, message, yes, no);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: '600px',
            data: dialogData
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                try {
                    const req = {
                        status: status
                    };
                    this.serviceService.updateApiRequest(item.id, req).subscribe(res => {
                        if (res && res.status) {
                            if (status == 'APPROVED') {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('API_REQUEST.UPDATE_STATUS.APPROVE_SUCCESS'));
                            } else if (status == 'REJECTED') {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('API_REQUEST.UPDATE_STATUS.REJECT_SUCCESS'));
                            }
                            this.getAll(this.page + 1, this.limit);
                            return;
                        }
                    });
                } catch (e) {
                    console.log(e);
                    this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
                }
            }
        });
    }

    view(element: any): void {
        const dialogRef = this.dialog.open(ApiRequestDetailComponent, { data: { element }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.getAll(this.page + 1, this.limit);
        });
    }


    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'APPROVED':
                return 'status-active';
            case 'REJECTED':
                return 'status-deactive';
            case 'REQUESTING':
                return 'status-pending';
        }
        return '';
    }

    onPageChange(event: PageEvent) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getAll(this.page + 1, this.limit);
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

    toTitleCase(input) {
        return this.helperService.convertTitleCase(input);
    }

}
