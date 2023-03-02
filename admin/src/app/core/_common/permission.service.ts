import {Injectable} from '@angular/core';
import appConfig from './config/appConfig';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LocalStorageService} from './cache-service/local-storage.service';
import {ApiHelperService} from './apiHelper.service';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class PermissionService {
    constructor(private localStorage: LocalStorageService, private api: ApiHelperService) {
    }

    /**
     * Check permission của user đối với 1 chức năng thông qua danh sách permission trong jwt
     *
     *
     * @param code: Mã permission tương ứng với từng chức năng
     * @param objCode: Mã object code tương ứng với nhóm chức năng: ví dụ CAMPAIGN, USER, GROUP,...
     * @param id: Id của object cần check permission: ví dụ check quyền của user đối với campaign co id=1 => id ở đây là 1.
     */
    canAccess(code: any, objCode?: any, id?: any): boolean {
        if (this.localStorage.isExist(appConfig.JWT)) {
            const token = this.localStorage.getItem(appConfig.JWT);
            const helper = new JwtHelperService();
            const jwt = helper.decodeToken(token);
            const permissions = JSON.parse(jwt.permissions);
            const generalPermissions: Array<any> = permissions.generalPermissions;
            if (generalPermissions.includes(code)) {
                return true;
            }
            const specificPermissions: Array<any> = permissions.specificPermissions;
            if (objCode == null || specificPermissions == null) {
                return false;
            }
            if (id == null) {
                return false;
            }
            const specificPermission: Array<any> = specificPermissions.filter(it => it.name == objCode);
            if (specificPermission == null) {
                return false;
            }
            let pers: Array<any> = [];
            specificPermission.forEach(it => {
                const permissionList: Array<any> = it.permissionList.filter(it => it.id == id).map(it => it.permissions)[0];
                pers = pers.concat(permissionList);
            });
            return pers.length > 0 && pers.includes(code);
        }
        return false;
    }

    getCurrentUserId() {
        if (this.localStorage.isExist(appConfig.JWT)) {
            const token = this.localStorage.getItem(appConfig.JWT);
            const helper = new JwtHelperService();
            const jwt = helper.decodeToken(token);
            return jwt.user_id;
        }
        return null;
    }

    getSpecificPermission() {
        if (this.localStorage.isExist(appConfig.JWT)) {
            const token = this.localStorage.getItem(appConfig.JWT);
            const helper = new JwtHelperService();
            const jwt = helper.decodeToken(token);
            const permissions = JSON.parse(jwt.permissions);
            const specificPermissions: Array<any> = permissions.specificPermissions;
            if (specificPermissions == null) {
                return null;
            }
            console.log(specificPermissions);
            return specificPermissions;
        }
        return null;
    }

    reloadPermission() {
        this.api.getAll(environment.REFRESH_PERMISSION).subscribe(res => {
            if (res && res.status) {
                const jwt = res.data.jwt;
                const token = res.data.token;
                this.localStorage.setItem(appConfig.CACHE_AUTH_TOKEN, token);
                this.localStorage.setItem(appConfig.JWT, jwt);
            }
        });
    }
}
