import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestConnector} from '../core/_common/rest.connector';
import {ApiHelperService} from '../core/_common/apiHelper.service';


@Injectable({providedIn: 'root'})
export class SimpleAuthService {

    constructor(private _restConnector: RestConnector,
                private apiHelperService: ApiHelperService) {

    }

    login(username: string, password: string): Observable<any> {
        const req: any = {
            userName: username,
            password: password
        };
        // return this._restConnector.post('auth/login', req, false);
        return this.apiHelperService.create('LOGIN', req, false);
    }

    checkLogin(): Observable<any> {
        return this.apiHelperService.create('CHECK_PERMISSION', null, true);
    }

    oauthLogin(userData: any): Observable<any> {
        const data: any = {
            gt: userData.idToken,
            access_token: userData.authToken,
            refresh_token: userData.authorizationCode
        };
        console.log(data);
        return this._restConnector.get('auth/get-jwt', false, data);
    }

    logOut(): Observable<any> {
        return this._restConnector.post('user/logout/', {});
    }

    sendLinkResetPass(email: string): Observable<any> {
        const req: any = {
            u: email
        };
        return this._restConnector.post('auth/sent/', req);
    }

    changePassword(password: string, token: string): Observable<any> {
        const req: any = {
            p: password
        };
        return this._restConnector.post('auth/reset-pass/' + token, req);
    }
}
