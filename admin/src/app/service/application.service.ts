import { Injectable } from '@angular/core';
import { ApiHelperService } from '../core/_common/apiHelper.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ApplicationService {

    constructor(private api: ApiHelperService) {
    }

    create(object: any): Observable<any> {
        return this.api.create(environment.APP_ADD, object);
    }

    getById(id: any): Observable<any> {
        return this.api.getById(environment.APP_GET_BY_ID, id);
    }

    getAll(object: any): Observable<any> {
        return this.api.getAll(environment.APP_GET_ALL, object);
    }

    addIp(id: any, object: any): Observable<any> {
        return this.api.createChildren(environment.APP_ADD_IP_WHITE_LIST, object, id);
    }

    removeIp(id: any, object: any): Observable<any> {
        return this.api.update(environment.APP_DELETE_IP_WHITE_LIST, id, object);
    }

    getListIp(id: any): Observable<any> {
        return this.api.getById(environment.APP_GET_LIST_IP_WHITE_LIST, id);
    }

    update(id: any, object: any): Observable<any> {
        return this.api.update(environment.APP_UPDATE, id, object);
    }

    updateStatus(id: any, object: any): Observable<any> {
        return this.api.update(environment.APP_UPDATE_STATUS_BY_ID, id, object);
    }

    delete(id: any): Observable<any> {
        return this.api.delete(environment.APP_DELETE_BY_ID, id);
    }

    // old
    getListToken(params: any): Observable<any> {
        return this.api.getAll(environment.APP_GET_LIST_TOKEN, params);
    }

    getListRefreshToken(id: any): Observable<any> {
        return this.api.getById(environment.APP_GET_LIST_REFRESH_TOKEN, id);
    }

    updateTokenStatus(id: any, payload: any): Observable<any> {
        return this.api.update(environment.APP_UPDATE_STATUS_TOKEN, id, payload);
    }

    approveToken(id: any): Observable<any> {
        return this.api.update(environment.APP_APPROVE_REFRESH_TOKEN, id);
    }

    unApproveToken(id: any): Observable<any> {
        return this.api.update(environment.APP_UNAPPROVE_REFRESH_TOKEN, id);
    }

    updateStatusToken(id: any, object: any): Observable<any> {
        return this.api.update(environment.APP_UPDATE_STATUS_TOKEN, id, object);
    }

    deleteToken(id: any): Observable<any> {
        return this.api.delete(environment.APP_DELETE_REFRESH_TOKEN, id);
    }

    getStatusList(): Observable<any> {
        return this.api.getAll(environment.APP_GET_STATUS_ACCESS_TOKEN);
    }

    getRequestStatusList(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_API_REQUEST_STATUS);
    }

    getListAccessTokenOfApp(id: any, object: any): Observable<any> {
        return this.api.getById(environment.ACCESSTOKEN_GET_ALL, id, object);
    }

    rejectAccessToken(id: any): Observable<any> {
        return this.api.update(environment.ACCESSTOKEN_CHANGE_STATUS, id, { status: 'REJECTED' });
    }

    // Logs request
    getAllLog(id: any, object: any): Observable<any> {
        return this.api.getById(environment.LOG_HISTORY_GET_ALL, id, object);
    }

    getLogById(appId: any, id: any): Observable<any> {
        return this.api.getChildren(environment.LOG_HISTORY_DETAIL, { appId: appId, id: id });
    }

    exportLog(id: any, object: any): Observable<any> {
        return this.api.exportFile(environment.LOG_HISTORY_EXPORT_FILE, object, 'blob', id);
    }

    getRequestStatus(): Observable<any> {
        return this.api.getAll(environment.LOG_HISTORY_REQUEST_STATUS);
    }

    // service
    getAllServiceNotSetting(id: any, object: any): Observable<any> {
        return this.api.getById(environment.SERVICE_GET_SERVICE_NOT_SETTING, id, object);
    }

    addService(id: any, object: any): Observable<any> {
        return this.api.createChildren(environment.SERVICE_ADD_SETTING, object, id);
    }

    removeService(object: any): Observable<any> {
        return this.api.deleteChildren(environment.APP_REMOVE_SERVICE, object);
    }

    cancelService(object: any): Observable<any> {
        return this.api.updateChildren(environment.APP_CANCEL_SERVICE, object);
    }

    addApi(id: any, object: any): Observable<any> {
        return this.api.createChildren(environment.SERVICE_REGISTER_CREATE, object, id);
    }

    removeApi(object: any): Observable<any> {
        return this.api.deleteChildren(environment.APP_UNREGIST_API, object);
    }

    getListService(id: any): Observable<any> {
        return this.api.getById(environment.APP_GET_LIST_SERVICE, id);
    }

    getServiceDetail(object: any): Observable<any> {
        return this.api.getChildren(environment.APP_SERVICE_GET_DETAIL, object);
    }

    getListApi(object: any): Observable<any> {
        return this.api.getChildren(environment.APP_SERVICE_GET_LIST_API, object);
    }

    addUser(id: any, object: any): Observable<any> {
        return this.api.createChildren(environment.APP_ADD_USER, object, id);
    }

    updateUser(params: any, object: any): Observable<any> {
        return this.api.updateChildren(environment.APP_UPDATE_USER, params, object);
    }

    getRoleFilter(id: any): Observable<any> {
        return this.api.getById(environment.APP_GET_ROLE_FILTER, id);
    }

    getListUser(id: any, object: any): Observable<any> {
        return this.api.getById(environment.APP_GET_LIST_USER, id, object);
    }

    getListAuthTypeApi(): Observable<any> {
        return this.api.getAll(environment.APP_GET_AUTH_TYPES);
    }

    removeUser(object: any): Observable<any> {
        return this.api.deleteChildren(environment.APP_DELETE_USER, object);
    }

    getListApiKeyOfApp(id: any, object: any): Observable<any> {
        return this.api.getById(environment.APP_GET_ALL_API_KEY, id, object);
    }

    createApiKey(id: any, object: any): Observable<any> {
        return this.api.createChildren(environment.APP_CREATE_API_KEY, object, id);
    }

    refreshApiKey(id: any, object: any): Observable<any> {
        return this.api.createChildren(environment.APP_REFRESH_API_KEY, object, id)
    }

    cancelApiKey(object: any): Observable<any> {
        return this.api.updateChildren(environment.APP_CANCEL_API_KEY, object)
    }

    deleteApiKey(params: any): Observable<any> {
        return this.api.deleteChildren(environment.APP_DELETE_API_KEY, params);
    }

}
