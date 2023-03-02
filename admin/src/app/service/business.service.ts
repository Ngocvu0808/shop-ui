import { Injectable } from '@angular/core';
import {ApiHelperService} from '../core/_common/apiHelper.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
    constructor(private api: ApiHelperService) {
    }

    buy(object: any): Observable<any> {
        return this.api.create(environment.PRODUCT_BUY, object);
    }

    getListBalance(params: any): Observable<any> {
        return this.api.getAll(environment.BUSINESS_GET_LIST_BALANCE, params, true, 2);
    }
    sell(object: any): Observable<any> {
        return this.api.create(environment.TRADING_LIST, object);
    }

    report( start: any, end: any): Observable<any> {
        return this.api.getChildren(environment.ROLE_UPDATE, { startTime: start, endTime: end });
    }
}
