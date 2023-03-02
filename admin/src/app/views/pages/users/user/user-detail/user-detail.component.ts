import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {LayoutUtilsService, MessageType} from '../../../../../core/_base/crud';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {viewRoleDetail} from '../../../../../shared/view-role-detail/view-role-detail.component';
import {UserService} from '../../../../../service/user.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    userData: any = {};
    userDetail: any = {};
    applications: any = [];
    roles: any = [];
    groups: any = [];
    previousUrl = '';

    genKeyEnable = true;
    apiKey = '';
    isCurrentUser: boolean = false;


    constructor(
        public dialog: MatDialog,
        private userService: UserService,
        private roleService: RoleService,
        private route: ActivatedRoute,
        private router: Router,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private translate: TranslateService,
        private permissionService: PermissionService,
        private layoutUtilsService: LayoutUtilsService,
    ) {
        this.previousUrl = this.route.snapshot.queryParamMap.get('url');
        this.getUserDetail();
    }

    async ngOnInit() {
        this.permissionService.getSpecificPermission();
        this.checkIsCurrentUser();
        await this.getApiKeyOfUser();

    }

    checkIsCurrentUser() {
        const currentUserId = this.permissionService.getCurrentUserId();
        const userIdDetail = this.route.snapshot.paramMap.get('id');
        if (currentUserId == null) {
            this.isCurrentUser = false;
            return;
        }
        this.isCurrentUser = currentUserId == userIdDetail;
    }

    getApiKeyOfUser() {
        // if (this.checkPermission('USER_GET_EXIST_API_KEY')) {
        // 	// this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
        // 	return;
        // }
        if (!this.isCurrentUser) {
            this.genKeyEnable = false;
            return;
        }
        this.userService.existApiKey().subscribe(res => {
            if (res) {
                if (res.status) {
                    if (res.data == null) {
                        this.genKeyEnable = true;
                    } else {
                        this.genKeyEnable = false;
                        this.apiKey = res.data;
                    }
                    this.cdr.markForCheck();
                }
            }
        });
    }

    getUserDetail() {
        if (this.checkPermission(PERMISSION_CODE.USER.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.userService.getById(this.route.snapshot.paramMap.get('id')).subscribe(res => {
            if (res && res.status) {
                this.userData = res.data;
                this.userDetail = res.data.userDetail;
                this.groups = this.userData.groups;
                this.roles = this.userData.roles;
                // this.applications = this.userData.campaigns;
                this.cdr.markForCheck();
            }
        });
    }

    back() {
        if (this.checkPermission(PERMISSION_CODE.USER.GET_ALL)) {
            this.router.navigateByUrl('/');
            return;
        }
        this.router.navigateByUrl(this.previousUrl ? this.previousUrl : '/user/list');
    }

    viewRoleDetail(id: any) {
        if (this.checkPermission(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            // this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        viewRoleDetail(id, this.dialog, this.roleService, this.notifyService, this.translate);
    }

    viewGroupDetail(id: any) {
        if (this.checkPermission(PERMISSION_CODE.GROUP.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.router.navigate(['/group', id], {queryParams: {url: window.location.pathname}});
    }

    getAPIKey() {
        if (this.checkPermission(PERMISSION_CODE.USER.DEVELOPER)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.userService.generateApiKey().subscribe(res => {
            if (res && res.status) {
                this.apiKey = res.data;
                this.genKeyEnable = false;
                this.cdr.markForCheck();
            }
        });
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
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

    reloadAPIKey() {
        if (this.checkPermission(PERMISSION_CODE.USER.USER_RELOAD_API_KEY)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.userService.reloadApiKey().subscribe(res => {
            console.log(res);
            if (res && res.status) {
                this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_EDIT'));
                this.apiKey = res.data;
                this.genKeyEnable = false;
                this.cdr.markForCheck();
            }
        });
    }
}
