import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { NotifyService } from '../../../../service/notify.service';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../confirm-dialog/confirm-dialog.component';
import { AppAddComponent } from '../app-add/app-add.component';
import { PermissionService } from '../../../../core/_common/permission.service';
import { ApplicationService } from '../../../../service/application.service';
import { PERMISSION_CODE } from '../../../../core/_common/config/permissionCode';

@Component({
    selector: 'mar-app-list',
    templateUrl: './app-list.component.html',
    styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit {
    displayedColumns: string[] = ['index', 'name', 'auth_type', 'clientId', 'creatorName', 'createdTime', 'status', 'actions'];
    dataSource = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    filterText: any = '';
    status: any = '';
    searchValue: '';

    // sort
    sortActive = '';
    sortDirection = '';
    loading: any;

    canAccess: boolean;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private appService: ApplicationService,
        private layoutUtilsService: LayoutUtilsService,
        private fb: FormBuilder,
        public cdr: ChangeDetectorRef,
        private router: Router,
        private notifyService: NotifyService,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.fetchData();
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return this.permissionService.canAccess(permission, objCode, id);
    }

    search() {
        this.page = 0;
        this.fetchData();
    }

    fetchData() {
        this.page = 0;
        this.getAll(1, this.limit);
    }

    getAll(page: number, limit: number) {
        if (!this.checkPermission(PERMISSION_CODE.USER.DEVELOPER)) {
            return
        }

        this.loading = true
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const req = {
            page: page,
            limit: limit,
            sort: sortValue,
            search: this.searchValue,
        };
        this.appService.getAll(req).subscribe(res => {
            if (res) {
                if (res.status) {
                    const data = res.data.list;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    data.forEach((it: { [x: string]: string; }) => {
                        it['actions'] = '';
                    });
                    this.dataSource = data;
                    this.cdr.markForCheck();
                    this.loading = false;
                }
            }
        });
    }

    updateStatus(item: any): void {
        const title = this.translate.instant('APP.CHANGE_STATUS.TITLE');
        const message = this.translate.instant('APP.CHANGE_STATUS.CONTENT') + item.name;
        const yes = this.translate.instant('COMMON.BTN_CONFIRM');
        const no = this.translate.instant('COMMON.BTN_CANCEL');
        const dialogData = new ConfirmDialogModel(title, message, yes, no);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: '600px',
            data: dialogData
        });
        const req = {
            status: item.status == 'ACTIVE' ? '1' : '0'
        };
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                try {
                    this.appService.updateStatus(item.id, req).subscribe(res => {
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
                    this.notifyService.notify('ERROR', '', this.translate.instant('CAMPAIGN.LIST.UPDATE_STATUS.ERROR_MESSAGE'));
                }
            }
        });
    }

    add() {
        const dialogRef = this.dialog.open(AppAddComponent, { data: {}, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.permissionService.reloadPermission();
            this.fetchData();
        });
    }

    viewApp(element: any) {
        this.router.navigate(['/application/app', element.id]);
    }

    deleteApp(element: any) {
        const _title: string = this.translate.instant('APP.DELETE.TITLE');
        const _description: string = this.translate.instant('APP.DELETE.CONTENT', { name: element.name });
        const _waitDescription: string = this.translate.instant('COMMON.DELETING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.delete(element.id).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.DELETE_SUCCESS'));
                            this.getAll(this.page + 1, this.limit);
                            this.permissionService.reloadPermission();
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

}
