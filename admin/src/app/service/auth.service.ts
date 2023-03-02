import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiHelperService} from '../core/_common/apiHelper.service';
import {environment} from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class AuthenticateService {

    constructor(private apiHelperService: ApiHelperService) {
    }

    login(username: string, password: string): Observable<any> {
        const req: any = {
            userName: username,
            password: password
        };
        return this.apiHelperService.create(environment.LOGIN, req, false);
    }

    checkPermission(): Observable<any> {
        return this.apiHelperService.create(environment.CHECK_PERMISSION);
    }

    validateToken(): Observable<any> {
        return this.apiHelperService.getAll(environment.VALIDATE_TOKEN);
    }

    logout(): Observable<any> {
        return this.apiHelperService.create(environment.LOGOUT);
    }
}
