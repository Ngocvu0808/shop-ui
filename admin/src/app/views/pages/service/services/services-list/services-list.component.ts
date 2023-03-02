import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { NotifyService } from '../../../../../service/notify.service';
import { PermissionService } from '../../../../../core/_common/permission.service';
import { PERMISSION_CODE } from '../../../../../core/_common/config/permissionCode';
import { ServiceAddComponent } from '../service-add/service-add.component';
import { ServiceEditComponent } from '../service-edit/service-edit.component';
import { each, find } from 'lodash';
import { HelperService } from '../../../../../core/_common/helper/helper.service';
import { ServiceService } from '../../../../../service/service.service';

@Component({
    selector: 'mar-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements OnInit {
    displayedColumns: string[] = ['index', 'code', 'name', 'nameSystem', 'description', 'tag', 'createdTime', 'creatorName', 'status', 'actions'];
    dataSource: Array<any> = [];
    filterStatus: Array<any> = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    allLabel: any = '';

    // sort
    sortActive = '';
    sortDirection = '';
    canAccess: boolean = true;

    systemFilterList: Array<any> = [];
    statusFilterList: Array<any> = [];
    systemValue = '';
    statusValue = '';

    searchValue: any = '';
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
        this.allLabel = 'Tất cả';
        this.page = 0;
        this.statusValue = '';
        this.systemValue = '';
        this.getSystems();
        this.getStatus();
        this.fetchData();
        this.canAdd = this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_ADD)
    }

    getSystems() {
        this.serviceService.getSystems().subscribe(res => {
            if (res && res.status) {
                this.systemFilterList = res.data;
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

    displayStatusFiler() {
        const status: Array<any> = [];
        each(this.statusValue, it => {
            status.push(this.toTitleCase(it));
        });
        return status;
    }

    toTitleCase(input) {
        return this.helperService.convertTitleCase(input);
    }

    getStatus() {
        this.serviceService.getListStatusApi().subscribe(res => {
            if (res && res.status) {
                this.statusFilterList = res.data.map(it => it.name);
                this.cdr.markForCheck();
            }
        });
    }

    fetchData() {
        this.getAll(this.page + 1, this.limit);
    }

    search() {
        this.page = 0;
        this.fetchData();
    }

    getAll(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_GET_ALL)) {
            return;
        }
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const params = {
            page: page,
            limit: limit,
            status: this.statusValue,
            systemIds: this.systemValue,
            search: this.searchValue,
            sort: sortValue,
        };
        this.loading = true;
        this.serviceService.getAllService(params).subscribe(res => {
            if (res) {
                if (res.status) {
                    const data = res.data.list;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    data.forEach(it => {
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
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_UPDATE_STATUS)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const title = this.translate.instant('SERVICE.UPDATE_STATUS.TITLE');
        const message =
            item.status == 'ACTIVE'
                ? this.translate.instant('SERVICE.UPDATE_STATUS.CONFIRM_DEACTIVE') + item.name
                : this.translate.instant('SERVICE.UPDATE_STATUS.CONFIRM_ACTIVE') + item.name;
        const yes = this.translate.instant('COMMON.BTN_CONFIRM');
        const no = this.translate.instant('COMMON.BTN_CANCEL');
        const dialogData = new ConfirmDialogModel(title, message, yes, no);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: '600px',
            data: dialogData,
        });
        const req = {
            status: item.status == 'ACTIVE' ? '1' : '0',
        };
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                try {
                    this.serviceService.updateStatusService(item.id, req).subscribe(res => {
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
        const dialogRef = this.dialog.open(ServiceAddComponent, {
            data: {},
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.page = Math.ceil((this.totalElement + 1) / this.limit) - 1;
            this.fetchData();
        });
    }

    edit(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ServiceEditComponent, {
            data: { element },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    delete(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_DELETE)) {
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
                this.serviceService.deleteService(element.id).subscribe(res => {
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
        this.fetchData();
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }
}
