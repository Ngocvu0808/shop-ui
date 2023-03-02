import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import appConfig from '../config/appConfig';
import { LocalStorageService } from '../cache-service/local-storage.service';
import { environment } from '../../../../environments/environment';
import { AuthenticateService } from '../../../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {


    constructor(
        private localStorage: LocalStorageService,
        private authService: AuthenticateService
    ) {
    }

    canActivate(): boolean {
        if (!this.localStorage.isExist(appConfig.CACHE_AUTH_TOKEN)) {
            window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
            return false;
        }
        if (this.localStorage.getItem(appConfig.CACHE_AUTH_TOKEN) == undefined || this.localStorage.getItem(appConfig.CACHE_AUTH_TOKEN) == 'undefined') {
            window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
            return false;
        }

        try {
            this.authService.validateToken().subscribe(res => {
                if (res) {
                    if (res.status) {
                        if (res.data) {
                            return true;
                        }
                    }
                    this.localStorage.clearAll();
                    window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
                    return false;
                }
            });
        } catch (e) {
            window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
            return false;
        }
        return true;
    }
}
