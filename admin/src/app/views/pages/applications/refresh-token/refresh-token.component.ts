import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NotifyService } from '../../../../service/notify.service';
import { DatePipe } from '@angular/common';
import { AppEditComponent } from '../app-edit/app-edit.component';
import { PermissionService } from '../../../../core/_common/permission.service';
import { PERMISSION_CODE } from '../../../../core/_common/config/permissionCode';
import { ApplicationService } from '../../../../service/application.service';

@Component({
    selector: 'mar-refresh-token',
    templateUrl: './refresh-token.component.html',
    styleUrls: ['./refresh-token.component.scss']
})
export class RefreshTokenComponent implements OnInit {

    appId: any = 0;
    previousUrl: any = '';
    appDetail: any = {};
    listIpWhiteList: Array<any> = [];
    apiKey: string = '';
    apiKeyStatus: boolean = true;
    authType: any;
    status: any;

    // sort
    sortActive = '';
    sortDirection = '';
    //input add ip white list
    ipWhiteList: any = '';
    listToken: Array<any> = [];
    listTokenFull: Array<any> = [];
    statusValue: Array<any> = [];
    filterStatus: Array<any> = ['ACTIVE', 'PENDING', 'DEACTIVE'];
    displayedColumns: Array<string> = ['index', 'refreshToken', 'createdTime', 'ip', 'expiredDate', 'developer', 'status', 'actions'];
    showInputIp: Boolean = false;
    ipBlank: Boolean = false;
    reloadApiTab: boolean = false

    tabId: number = 0;
    tabIdReload: number = 0;
    mothodApp: boolean = false;
    loading: any;

    @Input() isActiveTab: number;
    @Input() isReloadRefreshToken: any = false;

    @Output() reloadDetail = new EventEmitter();

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private route: ActivatedRoute,
        private appService: ApplicationService,
        private fb: FormBuilder,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private datePipe: DatePipe,
        private router: Router,
        private permissionService: PermissionService
    ) { }

    ngOnChanges() {
        this.appId = this.route.snapshot.paramMap.get('id');
        if (this.isActiveTab == 0) {
            this.getListRefreshToken();
        }
    }

    ngOnInit() {
        this.statusValue = this.filterStatus;
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

    getListRefreshToken() {
        if (
            this.checkPermission(PERMISSION_CODE.USER.DEVELOPER) ||
            this.checkPermission(PERMISSION_CODE.APPLICATION.CLIENT_GET_LIST_REFRESH_TOKEN)
        ) {
            return;
        }
        this.loading = true;
        this.appService.getListRefreshToken(this.appId).subscribe((res) => {
            if (res) {
                if (res.status) {
                    const data = res.data;
                    this.listToken = data;
                    this.listTokenFull = data;
                    this.cdr.markForCheck();
                    this.loading = false;
                }
            }
        });
    }

    filterTokenByStatus() {
        const status = this.statusValue;
        const listTokenFilter = [];
        if (status.length == 0) {
            this.getListRefreshToken();
        } else {
            this.listTokenFull.map((token) => {
                if (status.includes(token.status)) {
                    listTokenFilter.push(token);
                }
            });
            this.listToken = listTokenFilter;
        }
    }

    updateStatusToken(item: any): void {
        const req = {
            status: item.status == 'ACTIVE' ? '1' : '0',
        };
        const _title: string = this.translate.instant(item.status == 'ACTIVE' ? 'APP.DETAIL.TITLE_DEACTIVATE' : 'APP.DETAIL.TITLE_ACTIVATE');
        const _description: string = this.translate.instant(item.status == 'ACTIVE' ? 'APP.DETAIL.DESCRIPTION_DEACTIVE' : 'APP.DETAIL.DESCRIPTION_ACTIVE');
        const _waitDescription: string = this.translate.instant('APP.DETAIL.WAITING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            try {
                this.appService.updateStatusToken(item.id, req).subscribe((res) => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                            this.getListRefreshToken();
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
        });
    }

    approveToken(item: any): void {
        const _title: string = this.translate.instant('APP.DETAIL.TITLE_ACCEPT');
        const _description: string = this.translate.instant('APP.DETAIL.DESCRIPTION_ACCEPT');
        const _waitDescription: string = this.translate.instant('APP.DETAIL.WAITING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription, 'Confirm', 'Cancel');
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            try {
                this.appService.approveToken(item.id).subscribe((res) => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                            this.getListRefreshToken();
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
        });
    }

    unApproveToken(item: any): void {
        const _title: string = this.translate.instant('APP.DETAIL.TITLE_ACCEPT');
        const _description: string = this.translate.instant('APP.DETAIL.DESCRIPTION_REJECT');
        const _waitDescription: string = this.translate.instant('APP.DETAIL.WAITING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription, 'Confirm', 'Cancel');
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            try {
                this.appService.unApproveToken(item.id).subscribe((res) => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                            this.getListRefreshToken();
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
        });
    }

    deleteToken(element: any) {
        const _title: string = this.translate.instant('APP.DETAIL.TITLE_REMOVE');
        const _description: string = this.translate.instant('APP.DETAIL.DESCRIPTION_REMOVE');
        const _waitDescription: string = this.translate.instant('APP.DETAIL.WAITING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription, 'Confirm', 'Cancel');
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            try {
                this.appService.deleteToken(element.id).subscribe(async (res) => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.DELETE_SUCCESS'));
                            await this.getListRefreshToken();
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
            case 'EXPIRED':
                return 'status-expired';
        }
        return '';
    }

    onMasterStatusSelectChange(event: any) {
        this.statusValue = event;
        this.getListRefreshToken();
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.getListRefreshToken();
    }
}
