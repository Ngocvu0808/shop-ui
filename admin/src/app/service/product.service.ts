import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiHelperService} from '../core/_common/apiHelper.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    constructor(private api: ApiHelperService) {
    }
    create(object: any): Observable<any> {
        return this.api.create(environment.PRODUCT_ADD, object, true, 1);
    }

    getById(id: any): Observable<any> {
        return this.api.getById(environment.PRODUCT_DETAIL, id, '', true, 1);
    }

    getAll(params: any): Observable<any> {
        return this.api.getAll(environment.PRODUCT_LIST, params, true, 1);
    }

    update(id: any, object: any): Observable<any> {
        return this.api.update(environment.PRODUCT_UPDATE, id, object, true, 1);
    }

    disable(id: any): Observable<any> {
        return this.api.update(environment.PRODUCT_DISABLE, id, '', true, 1);
    }
    getByIdIn(params: any): Observable<any> {
        return this.api.getAll(environment.GET_BY_ID_IN, params, true, 1);
    }
    getAllTrade(params: any): Observable<any> {
        return this.api.getAll(environment.TRADING_LIST, params, true, 1);
    }

    sell(object: any): Observable<any> {
        return this.api.create(environment.PRODUCT_SELL, object, true, 1);
    }

    buy(object: any): Observable<any> {
        return this.api.create(environment.PRODUCT_BUY, object, true, 1);
    }

    getListProductValue(params: any): Observable<any> {
        return this.api.getAll(environment.PRODUCT_GET_LIST_PRODUCT_VALUE, params, true, 1);
    }
}
