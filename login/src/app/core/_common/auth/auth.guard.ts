import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import appConfig from '../config/appConfig';
import {LocalStorageService} from '../cache-service/local-storage.service';
import {ApiHelperService} from '../apiHelper.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(
        private localStorage: LocalStorageService,
        private api: ApiHelperService,
        private router: Router
    ) {
    }

    canActivate(): boolean {
        if (!this.localStorage.isExist(appConfig.CACHE_AUTH_TOKEN)) {
            this.router.navigate(['auth/login']);
            return false;
        }
        // check token is valid
        try {
            this.api.create('CHECK_PERMISSION').subscribe(res => {
                if (res.status == false) {
                    this.router.navigate(['auth/login']);
                    return false;
                }
            });
        } catch (e) {
            this.router.navigate(['auth/login']);
            return false;
        }
        return true;
    }
}
