import {Injectable} from '@angular/core';
import {ApiHelperService} from '../core/_common/apiHelper.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class ServiceService {

    constructor(private api: ApiHelperService) {
    }

    getSystems(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_SYSTEMS);
    }

    getAllTag(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_TAGS);
    }

    createService(object: any): Observable<any> {
        return this.api.create(environment.SERVICE_ADD, object);
    }

    updateService(id: any, object: any): Observable<any> {
        return this.api.update(environment.SERVICE_UPDATE, id, object);
    }

    getListStatusApi(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_API_STATUS);
    }

    getAllService(object: any): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_ALL, object);
    }

    getAllServiceNoPaging(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_ALL_NO_PAGING);
    }

    updateStatusService(id: any, object: any): Observable<any> {
        return this.api.update(environment.SERVICE_UPDATE_STATUS, id, object);
    }

    deleteService(id: any): Observable<any> {
        return this.api.delete(environment.SERVICE_DELETE, id);
    }

    //api request
    getApiRequestById(id: any): Observable<any> {
        return this.api.getById(environment.SERVICE_API_REQUEST_GET_BY_ID, id);
    }

    updateApiRequest(id: any, object: any): Observable<any> {
        return this.api.update(environment.SERVICE_API_REQUEST_UPDATE, id, object);
    }

    getListStatusApiRequest(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_API_REQUEST_STATUS);
    }

    getAllApiRequest(object: any): Observable<any> {
        return this.api.getAll(environment.SERVICE_API_REQUEST_GET_ALL, object);
    }

    // api
    getListTypeApi(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_API_TYPES);
    }

    getListMethodApi(): Observable<any> {
        return this.api.getAll(environment.SERVICE_GET_API_METHODS);
    }

    createApi(object: any): Observable<any> {
        return this.api.create(environment.SERVICE_API_ADD, object);
    }

    getApiById(id: any): Observable<any> {
        return this.api.getById(environment.SERVICE_API_GET_BY_ID, id);
    }

    updateApi(id: any, object: any): Observable<any> {
        return this.api.update(environment.SERVICE_API_UPDATE, id, object);
    }

    getAllApi(object: any): Observable<any> {
        return this.api.getAll(environment.SERVICE_API_GET_ALL, object);
    }

    updateApiStatus(id: any, object: any): Observable<any> {
        return this.api.update(environment.SERVICE_API_UPDATE_STATUS, id, object);
    }

    deleteApi(id: any): Observable<any> {
        return this.api.delete(environment.SERVICE_API_DELETE, id);
    }
}
