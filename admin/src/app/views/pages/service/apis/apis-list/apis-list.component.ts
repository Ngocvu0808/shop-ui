import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { each, find } from 'lodash';
import { NotifyService } from '../../../../../service/notify.service';
import { PermissionService } from '../../../../../core/_common/permission.service';
import { PERMISSION_CODE } from '../../../../../core/_common/config/permissionCode';
import { ApiDetailComponent } from '../api-detail/api-detail.component';
import { ApiAddComponent } from '../api-add/api-add.component';
import { ApiEditComponent } from '../api-edit/api-edit.component';
import { HelperService } from '../../../../../core/_common/helper/helper.service';
import { ServiceService } from '../../../../../service/service.service';

@Component({
    selector: 'mar-apis-list',
    templateUrl: './apis-list.component.html',
    styleUrls: ['./apis-list.component.scss']
})
export class ApisListComponent implements OnInit {
    displayedColumns: string[] = ['index', 'api', 'method', 'name', 'system', 'service', 'type', 'status', 'actions'];
    dataSource: Array<any> = [];
    filterStatus: Array<any> = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    status_value: Array<any> = [];
    searchValue: any = '';

    allLabel: any = '';
    // sort
    sortActive = '';
    sortDirection = '';
    canAccess: boolean = true;
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
    loading: any;
    canAdd: boolean;


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
        this.canAdd = this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_ADD)
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
        this.serviceService.getListStatusApi().subscribe(res => {
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

    displaySystemFilter() {
        const systems: Array<any> = [];
        each(this.systemValue, id => {
            const system = find(this.systemFilterList, it => it.id === id);
            if (system) {
                systems.push(this.toTitleCase(system.name));
            }
        });
        return systems;
    }

    onSystemFilterChange() {
        if (this.systemValue == '') {
            this.serviceFilterList = this.serviceList;
        } else {
            this.serviceFilterList = this.serviceList.filter(it => it.systemId === this.systemValue);
        }
        this.serviceValue = '';
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
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_GET_ALL)) {
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
            search: this.searchValue,
            sort: sortValue
        };
        this.loading = true;
        this.serviceService.getAllApi(req).subscribe(res => {
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

    updateStatus(item: any): void {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_UPDATE_STATUS)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const title = this.translate.instant('SERVICE.UPDATE_STATUS.TITLE');
        const message = item.status == 'ACTIVE' ? this.translate.instant('SERVICE.UPDATE_STATUS.CONFIRM_DEACTIVE') + item.name : this.translate.instant('SERVICE.UPDATE_STATUS.CONFIRM_ACTIVE') + item.name;
        const yes = this.translate.instant('COMMON.BTN_CONFIRM');
        const no = this.translate.instant('COMMON.BTN_CANCEL');
        const dialogData = new ConfirmDialogModel(title, message, yes, no);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: '600px',
            data: dialogData
        });
        const req = {
            status: item.status == 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE'
        };
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                try {
                    this.serviceService.updateApiStatus(item.id, req).subscribe(res => {
                        if (res) {
                            if (res.status) {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                                this.getAll(this.page + 1, this.limit);
                                return;
                            }
                            if (res.httpCode != 403) {
                                this.notifyService.notify('WARN', '', res.message);
                            }
                        }
                    });
                } catch (e) {
                    console.log(e);
                    this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
                }
            }
        });
    }

    add() {
        if (!this.canAdd) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ApiAddComponent, { data: {}, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.page = Math.ceil((this.totalElement + 1) / this.limit) - 1;
            this.fetchData();
        });
    }

    edit(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ApiEditComponent, { data: { element }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    viewDetail(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ApiDetailComponent, { data: { element }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    delete(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_DELETE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('SERVICE.DELETE.TITLE');
        const _description: string = this.translate.instant('SERVICE.DELETE.CONFIRM') + element.name;
        const _waitDescription: string = this.translate.instant('COMMON.DELETING');
        const _deleteMessage = this.translate.instant('COMMON.DELETE_SUCCESS');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.serviceService.deleteApi(element.id).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', _deleteMessage);
                            this.fetchData();
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            }
        });
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'status-active';
            case 'PENDING':
                return 'status-pending';
            case 'DEACTIVE':
                return 'status-deactive';
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
