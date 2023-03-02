import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog, Sort} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ApplicationService} from '../../../../../service/application.service';

@Component({
    selector: 'tokens-list',
    templateUrl: './tokens-list.component.html',
    styleUrls: ['./tokens-list.component.scss']
})
export class TokensListComponent implements OnInit {
    filterStatus: Array<any> = ['ACTIVE', 'PENDING'];
    displayedColumns: Array<string> = ['index', 'refreshToken', 'createdTime', 'ip', 'expiredDate', 'status', 'actions'];
    page = 0;
    limit = 0;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    listToken: any = [];
    // sort
    sortActive = '';
    sortDirection = '';

    allLabel = 'Tất cả';
    canAccess: boolean = true;
    selection = new SelectionModel<any>(true, []);
    listTokenFull: any = {};
    statusValue: Array<any> = [];
    loading: boolean = false;

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private appService: ApplicationService,
        private router: Router,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.statusValue = this.filterStatus;
        this.fetchData();
    }

    fetchData() {
        this.selection.clear();
        this.getAll(this.page + 1, this.limit);
    }

    search() {
        this.page = 0;
        this.fetchData();
    }

    getAll(page: number, limit: number) {
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const req = {
            page: page,
            limit: limit,
            status: this.statusValue,
            sort: sortValue
        };
        if (!this.checkPermission(PERMISSION_CODE.USER.DEVELOPER) || !this.checkPermission(PERMISSION_CODE.USER.GET_ALL_TOKEN)) {
            return;
        }
        this.loading = true;
        this.appService.getListToken(req).subscribe(res => {
            if (res && res.status) {
                const data = res.data.list;
                data.forEach(it => {
                    it['actions'] = '';
                });
                this.listToken = data;
                this.totalPage = res.data.totalPage;
                this.totalElement = res.data.num;
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    filterTokenByStatus() {
        this.fetchData();
    }

    updateStatusToken(item: any): void {
        const req = {
            status: item.status == 'ACTIVE' ? '1' : '0'
        };
        try {
            this.appService.updateTokenStatus(item.id, req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                        this.fetchData();
                        this.cdr.markForCheck();
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

    approveToken(item: any): void {
        try {
            this.appService.approveToken(item.id).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                        this.fetchData();
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

    unApproveToken(item: any): void {
        try {
            this.appService.unApproveToken(item.id).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                        this.fetchData();
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

    deleteToken(element: any) {
        try {
            this.appService.deleteToken(element.id).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.DELETE_SUCCESS'));
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
    }


    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'status-active';
            case 'PENDING':
                return 'status-pending';
            case 'DEACTIVE':
                return 'status-deactive';
            case 'EXPIRED':
                return 'status-expired';
        }
        return '';
    }

    pageChange(event: any) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getAll(this.page + 1, this.limit);
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return this.permissionService.canAccess(permission, objCode, id);
    }

}
