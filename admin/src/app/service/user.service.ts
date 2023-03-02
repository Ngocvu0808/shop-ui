import {Injectable} from '@angular/core';
import {ApiHelperService} from '../core/_common/apiHelper.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {

    constructor(private api: ApiHelperService) {
    }

    create(object: any): Observable<any> {
        return this.api.create(environment.USER_ADD, object);
    }

    getById(id: any): Observable<any> {
        return this.api.getById(environment.USER_GET_BY_ID, id);
    }

    getAll(object: any): Observable<any> {
        return this.api.getAll(environment.USER_GET_ALL, object);
    }

    updateRole(id: any, object: any): Observable<any> {
        return this.api.update(environment.USER_UPDATE_ROLES, id, object);
    }

    changePass(object: any): Observable<any> {
        return this.api.update(environment.USER_CHANGE_PASS, null, object);
    }

    resetPass(id: any): Observable<any> {
        return this.api.update(environment.USER_RESET_PASS, id);
    }

    changeStatus(id: any, action: any): Observable<any> {
        return this.api.update(environment[action], id);
    }

    changeStatusListUser(object: any): Observable<any> {
        return this.api.update(environment.USER_UPDATE_STATUS_LIST, '', object);
    }

    changeStatusAllUser(object: any): Observable<any> {
        return this.api.update(environment.USER_UPDATE_STATUS_ALL, '', object);
    }

    delete(id: any): Observable<any> {
        return this.api.delete(environment.USER_DELETE, id);
    }

    deleteListUser(object: any): Observable<any> {
        return this.api.update(environment.USER_DELETE_LIST, '', object);
    }

    deleteAllUser(): Observable<any> {
        return this.api.delete(environment.USER_DELETE_ALL);
    }

    generateApiKey(): Observable<any> {
        return this.api.getAll(environment.USER_API_KEY_GENERATE);
    }

    existApiKey(): Observable<any> {
        return this.api.getAll(environment.USER_GET_EXIST_KEY);
    }

    reloadApiKey(): Observable<any> {
        return this.api.getAll(environment.USER_API_KEY_RELOAD);
    }

    // filter
    getListStatusUser(): Observable<any> {
        return this.api.getAll(environment.USER_GET_LIST_STATUS);
    }

    getListGroupHasUser(): Observable<any> {
        return this.api.getAll(environment.USER_GET_GROUPS_ASSIGNED);
    }

    getListRoleAssigned(): Observable<any> {
        return this.api.getAll(environment.USER_GET_ROLES_ASSIGNED);
    }
}
