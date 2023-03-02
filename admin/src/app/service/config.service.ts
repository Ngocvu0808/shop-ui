import {Injectable} from '@angular/core';
import {ApiHelperService} from '../core/_common/apiHelper.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class ConfigService {

    constructor(private api: ApiHelperService) {
    }

    // sys config
    addSysConfig(object: any): Observable<any> {
        return this.api.create(environment.SYSTEM_CONFIG_ADD, object);
    }

    updateSysConfig(id: any, object: any): Observable<any> {
        return this.api.update(environment.SYSTEM_CONFIG_UPDATE, id, object);
    }

    getAllSysConfig(object: any): Observable<any> {
        return this.api.getAll(environment.SYSTEM_CONFIG_GET_ALL, object);
    }

    getAllSysConfigKey(): Observable<any> {
        return this.api.getAll(environment.SYSTEM_CONFIG_GET_ALL_KEY);
    }

    deleteSysConfig(id: any): Observable<any> {
        return this.api.delete(environment.SYSTEM_CONFIG_DELETE, id);
    }

    // field config
    getTypeValueFieldConfig(object: any): Observable<any> {
        return this.api.getAll(environment.FIELD_CONFIG_GET_TYPE_VALUE, object);
    }

    addFieldConfig(object: any): Observable<any> {
        return this.api.create(environment.FIELD_CONFIG_ADD, object);
    }

    updateFieldConfig(id: any, object: any): Observable<any> {
        return this.api.update(environment.FIELD_CONFIG_UPDATE, id, object);
    }

    getAllFieldConfig(object: any): Observable<any> {
        return this.api.getAll(environment.FIELD_CONFIG_GET_ALL, object);
    }

    getTypeFieldConfig(object: any): Observable<any> {
        return this.api.getAll(environment.FIELD_CONFIG_GET_TYPE, object);
    }

    deleteFieldConfig(id: any): Observable<any> {
        return this.api.delete(environment.FIELD_CONFIG_DELETE, id);
    }

    getFieldObjects(): Observable<any> {
        return this.api.getAll(environment.FIELD_OBJECTS);
    }

}
