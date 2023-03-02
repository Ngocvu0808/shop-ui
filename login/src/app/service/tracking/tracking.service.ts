import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestConnector} from '../../core/_common/rest.connector';
import {ApiHelperService} from '../../core/_common/apiHelper.service';

@Injectable()
export class TrackingService {

	constructor( private service: ApiHelperService) {
	}

	test(api: any, obj: any): Observable<any> {
		return this.service.create(api, obj);
	}
}
