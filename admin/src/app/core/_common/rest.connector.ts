'use strict';


import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LocalStorageService} from './cache-service/local-storage.service';
import {NotifyService} from '../../service/notify.service';
import appConfig from './config/appConfig';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class RestConnector {
    httpOption: any = {};

    constructor(private httpClient: HttpClient,
                private localStorageService: LocalStorageService,
                private notifyService: NotifyService) {
    }

    handleError(error: HttpErrorResponse) {
        console.log('-------------------HandleError', error.message, error.name);
        if (error.error instanceof ErrorEvent) {
            return throwError(error);
        }
        switch (error.status) {
            case 401:
                localStorage.clear();
                window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
                break;
            default:
                if (!this.localStorageService.isExist(appConfig.CACHE_AUTH_TOKEN)) {
                    window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
                    return;
                }
        }
    }

    getApiUrl(index?: any) {
        return environment.API_URL[index];
    }

    public get(url: string, params?: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl(indexUrl) + url;
        this.httpOption = this.getHttpOption(hasAuth, params);
        try {
            return this.httpClient.get<any>(fullUrl, this.httpOption).pipe(
                map((resp: any) => {
                    if (!resp.status) {

                        this.checkHttpCode(resp.httpCode);
                    }
                    return resp;
                }),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public getByUrl(url: string, params?: any): Observable<HttpResponse<any>> {
        this.httpOption = this.getHttpOption(true, params);
        try {
            return this.httpClient.get<any>(url, this.httpOption).pipe(
                map((resp: any) => {
                    if (!resp.status) {
                        this.checkHttpCode(resp.httpCode);
                    }
                    return resp;
                }),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public post(url: string, data: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl(indexUrl) + url;
        this.httpOption = this.getHttpOption(hasAuth);
        try {
            return this.httpClient.post<any>(fullUrl, data, this.httpOption).pipe(
                map((resp: any) => {
                    if (!resp.status) {
                        this.checkHttpCode(resp.httpCode);
                    }
                    return resp;
                }),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            if (url != environment.CHECK_PERMISSION) {
                throw new Error(err);
            }
        }
    }

    public postUrl(url: string, data: any, hasAuth: boolean = true): Observable<HttpResponse<any>> {
        this.httpOption = this.getHttpOption(hasAuth);
        try {
            return this.httpClient.post<any>(url, data, this.httpOption).pipe(
                map((resp: any) => {
                    if (!resp.status) {
                        this.checkHttpCode(resp.httpCode);
                    }
                    return resp;
                }),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public put(url: string, data: any, hasAuth: boolean = true, indexUrl: number = 0): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl(indexUrl) + url;
        this.httpOption = this.getHttpOption(hasAuth);
        try {
            return this.httpClient.put<any>(fullUrl, data, this.httpOption).pipe(
                map((resp: any) => {
                    if (!resp.status) {
                        this.checkHttpCode(resp.httpCode);
                    }
                    return resp;
                }),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public delete(url: string, hasAuth: boolean = true, indexUrl: number = 0): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl(indexUrl) + url;
        this.httpOption = this.getHttpOption(hasAuth);
        try {
            return this.httpClient.delete(fullUrl, this.httpOption).pipe(
                map((resp: any) => {
                    if (!resp.status) {
                        this.checkHttpCode(resp.httpCode);
                    }
                    return resp;
                }),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public exportFile(url: string, params?: any, responseType?: any, indexUrl: number = 0): Observable<Blob> {
        const fullUrl: string = this.getApiUrl(indexUrl) + url;
        this.httpOption = this.getHttpOption(true, params, responseType);
        try {
            return this.httpClient.get<HttpResponse<Blob>>(fullUrl, this.httpOption).pipe(
                map((resp: any) => {
                    if (!resp.status) {
                        this.checkHttpCode(resp.httpCode);
                    }
                    return resp;
                }),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    checkHttpCode(httpCode: any) {
        if (httpCode == 401) {
            window.location.replace(`${environment.AUTH_LOGIN_PAGE}?returnUrl=${window.location.origin}/auth/callback&state=/`);
            return;
        }
        if (httpCode == 403) {
            this.notifyService.notify('WARN', '', 'Không có quyền thực hiện chức năng này');
        }
    }

    private getHttpOption(hasAuth: boolean, obj?, responseType?, autoSetContentType: boolean = false) {
        const httpOption = {
            headers: new HttpHeaders({
                    'Accept': ['application/json'],
                    'Access-Control-Allow-Origin': '*'
                },
            ),
            params: new HttpParams()
        };

        if (hasAuth) {
            httpOption.headers = httpOption.headers.set('token', this.localStorageService.getItem(appConfig.CACHE_AUTH_TOKEN));
            // httpOption.headers = httpOption.headers.set('Authorization', this.localStorageService.getItem(appConfig.JWT));
            httpOption.headers = httpOption.headers.set('csid', '1');
        }
        if (responseType != undefined) {
            httpOption['responseType'] = responseType;
        }
        if (obj) {
            const field = Object.keys(obj);
            const valueField = Object.values(obj);
            for (let i = 0; i < field.length; i++) {
                if (valueField[i] && valueField[i] !== null) {
                    httpOption.params = httpOption.params.append(field[i], valueField[i].toString());
                }
            }
        }
        if (!autoSetContentType) {
            httpOption.headers = httpOption.headers.set('Content-Type', 'application/json');
        }
        return httpOption;
    }

}
