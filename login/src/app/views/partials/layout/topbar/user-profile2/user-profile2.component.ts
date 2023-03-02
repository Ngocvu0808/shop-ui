// Angular
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../../../core/_common/cache-service/local-storage.service";
import appConfig from "../../../../../core/_common/config/appConfig";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";

@Component({
    selector: 'kt-user-profile2',
    templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
    _user = {
        fullname: '',
        pic: './assets/media/users/default.jpg',
        username: ''
    };
    @Input() avatar = true;
    @Input() greeting = true;
    @Input() badge: boolean;
    @Input() icon: boolean;

    /**
     * Component constructor
     *
     * @param cdr
     * @param localStorage
     * @param router
     */
    constructor(private cdr: ChangeDetectorRef,
                private localStorage: LocalStorageService,
                private router: Router) {
        if (this.localStorage.isExist(appConfig.JWT)) {
            const token = this.localStorage.getItem(appConfig.JWT);
            const helper = new JwtHelperService();
            const userInfo = helper.decodeToken(token);
            this._user.fullname = userInfo.name;
            this._user.username = userInfo.preferred_username;
            this.cdr.markForCheck();
        }
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
    }

    /**
     * Log out
     */
    logout() {
        if (this.localStorage.isExist(appConfig.CACHE_AUTH_TOKEN)) {
            this.localStorage.removeItem(appConfig.CACHE_AUTH_TOKEN);
        }
        if (this.localStorage.isExist(appConfig.JWT)) {
            this.localStorage.removeItem(appConfig.JWT);
        }
        this.router.navigateByUrl('auth/login');
    }
}
