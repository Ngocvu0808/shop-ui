import {Injectable} from '@angular/core';
import {RestConnector} from './rest.connector';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ApiHelperService {
    constructor(private _restConnector: RestConnector) {
    }

    getAll(path: string, obj?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        return this._restConnector.get(path, obj, hasAuth, indexUrl);
    }

    getByUrl(url: string, obj?: any): Observable<any> {
        return this._restConnector.getByUrl(url, obj);
    }


    getById(path: string, id: string = '', obj?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this._restConnector.get(path, obj, hasAuth, indexUrl);
    }

    getChildren(path: string, params: any, obj?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        const keys = Object.keys(params);
        for (const key of keys) {
            if (path.toString().includes(':' + key)) {
                path = path.toString().replace(':' + key, params[key]);
            }
        }
        return this._restConnector.get(path, obj, hasAuth, indexUrl);
    }

    create(path: string, obj?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        return this._restConnector.post(path, obj, hasAuth, indexUrl);
    }

    createChildren(path: string, obj?: any, id: string = '', hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this._restConnector.post(path, obj, hasAuth, indexUrl);
    }

    update(path: string, id: string = '', obj?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this._restConnector.put(path, obj, hasAuth, indexUrl);

    }

    updateChildren(path: string, params: any, obj?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        const keys = Object.keys(params);
        for (const key of keys) {
            if (path.toString().includes(':' + key)) {
                path = path.toString().replace(':' + key, params[key]);
            }
        }
        return this._restConnector.put(path, obj, hasAuth, indexUrl);
    }

    delete(path: string, id: string = '', hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this._restConnector.delete(path, hasAuth, indexUrl);
    }

    deleteChildren(path: string, params: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        const keys = Object.keys(params);
        for (const key of keys) {
            if (path.toString().includes(':' + key)) {
                path = path.toString().replace(':' + key, params[key]);
            }
        }
        return this._restConnector.delete(path, hasAuth, indexUrl);
    }

    deletePost(path: string, id: string = '', obj?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this._restConnector.post(path, obj, hasAuth, indexUrl);
    }

    exportFile(path: string, params: any, responseType: any, id?: any, indexUrl: number = 0): Observable<any> {
        if (id !== '') {
            path = path.toString().replace(':id', id);
        }
        return this._restConnector.exportFile(path, params, responseType, indexUrl);
    }
}
