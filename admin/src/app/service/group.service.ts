import {Injectable} from '@angular/core';
import {ApiHelperService} from '../core/_common/apiHelper.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class GroupService {

    constructor(private api: ApiHelperService) {
    }

    create(object: any): Observable<any> {
        return this.api.create(environment.GROUP_USER_ADD, object);
    }

    getById(id: any): Observable<any> {
        return this.api.getById(environment.GROUP_USER_GET_BY_ID, id);
    }

    getAll(object: any): Observable<any> {
        return this.api.getAll(environment.GROUP_USER_GET_ALL, object);
    }

    update(id: any, object: any): Observable<any> {
        return this.api.update(environment.GROUP_USER_UPDATE, id, object);
    }

    delete(id: any): Observable<any> {
        return this.api.delete(environment.GROUP_USER_DELETE, id);
    }

    getRoleOfGroup(id: any): Observable<any> {
        return this.api.getById(environment.GROUP_USER_GET_ALL_ROLE, id);
    }

    getAllRoleAssigned(): Observable<any> {
        return this.api.getAll(environment.GROUP_ROLE_FILTER);
    }

    addUsers(id: any, object: any): Observable<any> {
        return this.api.createChildren(environment.GROUP_USER_ADD_USERS, object, id);
    }

    removeUser(object: any): Observable<any> {
        return this.api.deleteChildren(environment.GROUP_USER_DELETE_USER, object);
    }

    getAllUserAndGroup(filter): Observable<any> {
        return this.api.getAll(environment.GET_USER_GROUP_LIST, {filter: filter});
    }
}
