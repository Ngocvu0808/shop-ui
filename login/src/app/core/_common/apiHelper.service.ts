import {Injectable} from '@angular/core';
import {RestConnector} from './rest.connector';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ApiHelperService {
    constructor(private restConnector: RestConnector) {
    }

    getAll(apiName: string, obj?: any, hasAuth: boolean = true): Observable<any> {
        const url = environment[apiName];
        return this.restConnector.get(url, hasAuth, obj);
    }

    getByUrl(url: string, obj?: any): Observable<any> {
        return this.restConnector.getByUrl(url, obj);
    }


    getById(apiName: string, id: string = '', obj?: any, hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        if (id !== '') {
            url = url.toString().replace(':id', id);
        } else {
            return null;
        }
        return this.restConnector.get(url, hasAuth, obj);
    }

    getChildren(apiName: string, params: any, obj?: any, hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        const keys = Object.keys(params);
        for (const key of keys) {
            if (url.toString().includes(':' + key)) {
                url = url.toString().replace(':' + key, params[key]);
            }
        }
        return this.restConnector.get(url, hasAuth, obj);
    }

    create(apiName: string, obj?: any, hasAuth: boolean = true): Observable<any> {
        const url = environment[apiName];
        return this.restConnector.post(url, obj, hasAuth);
    }

    createChildren(apiName: string, obj?: any, id: string = '', hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        if (id !== '') {
            url = url.toString().replace(':id', id);
        }
        return this.restConnector.post(url, obj, hasAuth);
    }

    updatePost(apiName: string, id: string = '', obj?: any, hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        if (id !== '') {
            url = url.toString().replace(':id', id);
        }
        return this.restConnector.post(url, obj, hasAuth);

    }

    update(apiName: string, id: string = '', obj?: any, hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        if (id !== '') {
            url = url.toString().replace(':id', id);
        }
        return this.restConnector.put(url, obj, hasAuth);

    }

    updateChildren(apiName: string, params: any, obj?: any, hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        const keys = Object.keys(params);
        for (const key of keys) {
            if (url.toString().includes(':' + key)) {
                url = url.toString().replace(':' + key, params[key]);
            }
        }
        return this.restConnector.put(url, obj, hasAuth);
    }

    delete(apiName: string, id: string = '', hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        if (id !== '') {
            url = url.toString().replace(':id', id);
        } else {
            return null;
        }
        return this.restConnector.delete(url, hasAuth);
    }

    deleteChildren(apiName: string, params: any, hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        const keys = Object.keys(params);
        for (const key of keys) {
            if (url.toString().includes(':' + key)) {
                url = url.toString().replace(':' + key, params[key]);
            }
        }
        return this.restConnector.delete(url, hasAuth);
    }

    deleteUrl(url: string, hasAuth: boolean = true): Observable<any> {
        return this.restConnector.delete(url, hasAuth);
    }

    deletePost(apiName: string, id: string = '', obj?: any, hasAuth: boolean = true): Observable<any> {
        let url = environment[apiName];
        if (id !== '') {
            url = url.toString().replace(':id', id);
        } else {
            return null;
        }
        return this.restConnector.post(url, obj, hasAuth);
    }
}
