import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
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
import { EventEmitter } from 'protractor';
import { AppGetApiKeyComponent } from '../app-get-api-key/app-get-api-key.component';
import { UserService } from '../../../../service/user.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'mar-app-detail',
    templateUrl: './app-detail.component.html',
    styleUrls: ['./app-detail.component.scss'],
})
export class AppDetailComponent implements OnInit {
    appId: any = 0;
    previousUrl: any = '';
    appDetail: any = {};
    listIpWhiteList: Array<any> = [];
    apiKey: string = '';
    apiKeyStatus: boolean = true;
    authType: any;
    status: any;
    //input add ip white list
    ipWhiteList: any = '';
    listToken: Array<any> = [];
    listTokenFull: Array<any> = [];
    statusValue: Array<any> = [];
    filterStatus: Array<any> = ['ACTIVE', 'PENDING', 'DEACTIVE'];
    displayedColumns: Array<string> = ['index', 'refreshToken', 'createdTime', 'ip', 'expiredDate', 'developer', 'status', 'actions'];
    showInputIp: Boolean = false;
    ipBlank: Boolean = false;
    reloadApiTab: boolean = false;
    reloadTab: any = 0;

    tabId: number = 0;
    tabIdReload: number = 0;
    loading: boolean = false;

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
        private permissionService: PermissionService,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.appId = this.route.snapshot.paramMap.get('id');
        this.statusValue = this.filterStatus;
        this.getAppDetail();
        this.getListIpWhiteList();
    }

    reloadTabDetail(event) {
        event ? this.ngOnInit() : '';
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

    getAppDetail() {
        this.appService.getById(this.appId).subscribe((res) => {
            if (res) {
                if (res.status) {
                    this.appDetail = res.data;
                    this.authType = res.data.auth_type == 'OAUTH' ? true : false;
                    this.reloadTab = res.data.auth_type == 'OAUTH' ? 0 : 1;
                    if (res.data.api_key) {
                        this.apiKeyStatus = false;
                        this.apiKey = res.data.api_key;
                    }
                    else {
                        this.apiKeyStatus = true;
                        this.apiKey = '';
                    }
                    this.cdr.markForCheck();
                }
            }
        });
    }

    cancelApiKey() {
        const req = {
            id: this.appId,
            apiKey: this.apiKey
        }
        this.reloadApiTab = false;
        const _title: string = this.translate.instant('APP.API_KEY.DELETE.TITLE');
        const _description: string = this.translate.instant('APP.API_KEY.DELETE.CONTENT');
        const _waitDescription: string = this.translate.instant('COMMON.UPDATING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.cancelApiKey(req).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                            this.apiKeyStatus = true;
                            this.reloadApiTab = true;
                            this.cdr.markForCheck()
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

    addIpWhiteList() {
        this.ipBlank = false;
        if (this.showInputIp == false) {
            this.showInputIp = true;
        } else {
            this.addIp();
        }
    }

    addIp() {
        const listIp = [];
        listIp.push(this.ipWhiteList);
        const req = {
            ids: listIp,
        };
        if (listIp[0].length == 0) {
            this.ipBlank = true;
            return;
        }
        try {
            this.appService.addIp(this.appDetail.id, req).subscribe((res) => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ADD'));
                        this.getListIpWhiteList();
                        this.ipWhiteList = '';
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
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ERROR'));
        }
    }

    deleteIp(element: any) {
        const listIp = [];
        listIp.push(element);
        const req = {
            ids: listIp,
        };
        const _title: string = this.translate.instant('APP.DETAIL.TITLE_REMOVE_IP');
        const _description: string = this.translate.instant('APP.DETAIL.DESCRIPTION_REMOVE_IP');
        const _waitDescription: string = this.translate.instant('APP.DETAIL.WAITING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            try {
                this.appService.removeIp(this.appId, req).subscribe((res) => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.DELETE_SUCCESS'));
                            this.getListIpWhiteList();
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
        });
    }

    getListIpWhiteList() {
        if (this.checkPermission('DEVELOPER') || this.checkPermission('CLIENT_GET_LIST_IP')) {
            return;
        }
        this.appService.getListIp(this.appId).subscribe((res) => {
            if (res) {
                if (res.status) {
                    this.listIpWhiteList = res.data.ip_list;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    getApiKey() {
        this.userService.generateApiKey().subscribe((res) => {
            if (res) {
                if (res.status) {
                    const data = res.data;
                    if (data != null) {
                        const dialogRef = this.dialog.open(AppGetApiKeyComponent, { data: { apiKey: data }, disableClose: true });
                        dialogRef.afterClosed().subscribe((res) => {
                            if (!res) {
                                return;
                            }
                        });
                    }
                }
            }
        });
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

    refreshApiKey() {
        const obj = {};
        this.reloadApiTab = false;
        const _title: string = this.translate.instant('APP.API_KEY.CREATE_NEW.TITLE');
        const _description: string = this.translate.instant('APP.API_KEY.CREATE_NEW.CONTENT');
        const _waitDescription: string = this.translate.instant('APP.API_KEY.CREATE_NEW.CREATING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.refreshApiKey(this.appId, obj).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.apiKey = res.id;
                            this.apiKeyStatus = false;
                            this.reloadApiTab = true;
                            this.cdr.markForCheck()
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            }
        });
    }

    createApiKey() {
        const _title: string = this.translate.instant('APP.API_KEY.CREATE_NEW.TITLE');
        const _description: string = this.translate.instant('APP.API_KEY.CREATE_NEW.CONTENT');
        const _waitDescription: string = this.translate.instant('APP.API_KEY.CREATE_NEW.CREATING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        const req = {};
        this.reloadApiTab = false;
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.createApiKey(this.appId, req).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.apiKey = res.id;
                            this.apiKeyStatus = false;
                            this.reloadApiTab = true;
                            this.cdr.markForCheck()
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            }
        });
    }

    changeStatusApp(): void {
        const title = this.translate.instant('APP.CHANGE_STATUS.TITLE');
        const message = this.translate.instant('APP.CHANGE_STATUS.CONTENT') + this.appDetail.name;
        const yes = this.translate.instant('COMMON.BTN_CONFIRM');
        const no = this.translate.instant('COMMON.BTN_CANCEL');
        const dialogData = new ConfirmDialogModel(title, message, yes, no);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: '600px',
            data: dialogData
        });
        const req = {
            status: this.appDetail.status == 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE',
        };
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                try {
                    this.appService.updateStatus(this.appId, req).subscribe(res => {
                        if (res) {
                            if (res.status) {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                                this.getAppDetail();
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

    copyMessage(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.layoutUtilsService.showActionNotification('Copied to clipboard', MessageType.Delete, 3000, true, false);
    }

    editApp(appDetail) {
        const dialogRef = this.dialog.open(AppEditComponent, { data: { appDetail }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.getAppDetail();
        });
    }

    back() {
        this.router.navigateByUrl(this.previousUrl ? this.previousUrl : '/application/app');
    }

    tabChange(event: any) {
        this.reloadTab = parseInt(event.tab.ariaLabel);
        this.cdr.markForCheck();
    }
}
