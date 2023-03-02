import {Injectable} from '@angular/core';
import {ApiHelperService} from '../core/_common/apiHelper.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class RoleService {

    constructor(private api: ApiHelperService) {
    }

    getAllPermission(): Observable<any> {
        return this.api.getAll(environment.ROLE_GET_ALL_PERMISSION);
    }

    create(object: any): Observable<any> {
        return this.api.create(environment.ROLE_ADD, object);
    }

    getById(id: any): Observable<any> {
        return this.api.getById(environment.ROLE_GET_BY_ID, id);
    }

    getAll(params: any): Observable<any> {
        return this.api.getAll(environment.ROLE_GET_ALL, params);
    }

    getAllRoleActive(): Observable<any> {
        return this.api.getAll(environment.ROLE_GET_ALL_ACTIVE);
    }

    update(roleId: any, object: any): Observable<any> {
        return this.api.update(environment.ROLE_UPDATE, roleId, object);
    }

    delete(id: any): Observable<any> {
        return this.api.delete(environment.ROLE_DELETE, id);
    }

    getAllRoleByObjectCode(objectCode: any): Observable<any> {
        return this.api.getAll(environment.ROLE_GET_ALL_FILTER, {object: objectCode});
    }

    getListTypes(): Observable<any> {
        return this.api.getAll(environment.ROLE_GET_TYPE);
    }
}
