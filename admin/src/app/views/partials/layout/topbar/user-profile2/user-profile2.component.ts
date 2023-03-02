// Angular
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../../../core/_common/cache-service/local-storage.service';
import appConfig from '../../../../../core/_common/config/appConfig';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticateService } from '../../../../../service/auth.service';
import { environment } from '../../../../../../environments/environment';
import { NotifyService } from '../../../../../service/notify.service';
import { UserChangePasswordComponent } from '../../../../pages/users/user/user-change-password/user-change-password.component';
import { MatDialog } from '@angular/material';
import { PermissionService } from '../../../../../core/_common/permission.service';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-user-profile2',
    templateUrl: './user-profile2.component.html',
    styleUrls: ['./user-profile2.component.scss'],
})
export class UserProfile2Component implements OnInit {
    // Public properties
    // user$: Observable<User>;
    _user = {
        id: '',
        fullname: '',
        pic: './assets/media/users/default.jpg',
        username: '',
    };
    userAvatarName:string = ''

    @Input() avatar = true;
    @Input() greeting = true;
    @Input() badge: boolean;
    @Input() icon: boolean;

    /**
     * Component constructor
     *
     * @param cdr
     * @param authService
     * @param localStorage
     * @param notifyService
     */
    constructor(
        private cdr: ChangeDetectorRef,
        private authService: AuthenticateService,
        private localStorage: LocalStorageService,
        private notifyService: NotifyService,
        public dialog: MatDialog,
        private permissionService: PermissionService,
        private router: Router
    ) {}

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
        // this.user$ = this.store.pipe(select(currentUser));
        if (this.localStorage.isExist(appConfig.JWT)) {
            const token = this.localStorage.getItem(appConfig.JWT);
            const helper = new JwtHelperService();
            const userInfo = helper.decodeToken(token);
            this._user.fullname = userInfo.iss;
            this._user.username = userInfo.preferred_username;
            this._user.id = userInfo.user_id;
            this.cdr.markForCheck();
            this.userAvatarName = this._user.fullname.match(/\b(\w)/g).join('');
        }
    }

    /**
     * Log out
     */
    logout() {
        this.authService.logout().subscribe(res => {
            if (res) {
                if (res.status) {
                    if (this.localStorage.isExist(appConfig.CACHE_AUTH_TOKEN)) {
                        this.localStorage.removeItem(appConfig.CACHE_AUTH_TOKEN);
                    }
                    if (this.localStorage.isExist(appConfig.JWT)) {
                        this.localStorage.removeItem(appConfig.JWT);
                    }
                    window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
                } else {
                    this.notifyService.notify('ERROR', '', 'Có lỗi xảy ra');
                }
            }
        });
    }

    changePassword() {
        const dialogRef = this.dialog.open(UserChangePasswordComponent, { disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

    routerApplication() {
        this.router.navigate(['/application/app']);
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }
}
