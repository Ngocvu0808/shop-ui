'use strict';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import appConfig from './config/appConfig';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {LocalStorageService} from './cache-service/local-storage.service';
import {Router} from '@angular/router';
import {NotifyService} from '../../service/notify.service';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class RestConnector {
    httpOption: any = {};

    constructor(private httpClient: HttpClient,
                private localStorageService: LocalStorageService,
                private notifyService: NotifyService,
                private router: Router) {
    }

    getApiUrl() {
        return environment.API_URL;
    }

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            return throwError(error);
        }
        switch (error.status) {
            case 400:
                this.notifyService.notify('ERROR', '', 'Bad request');
                break;
            case 401:
                localStorage.removeItem(appConfig.CACHE_AUTH_TOKEN);
                this.router.navigateByUrl('auth/login');
                break;
            case 404:
                // this.notifyService.notify('ERROR', '404 ERROR', error.error.message);
                break;
            case 500:
                // this.notifyService.notify('ERROR', '', 'Có lỗi xảy ra');
                break;
            default:
                if (!this.localStorageService.isExist(appConfig.CACHE_AUTH_TOKEN)) {
                    this.router.navigate(['auth/login']);
                    return;
                }
        }
    }

    public get(url: string, hasAuth: boolean = true, params?: any): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl() + url;
        this.httpOption = this.getHttpOption(hasAuth, params);
        try {
            return this.httpClient.get<any>(fullUrl, this.httpOption).pipe(
                map((resp: any) => resp),
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
                map((resp: any) => resp),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public post(url: string, data: any, hasAuth: boolean = true): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl() + url;
        this.httpOption = this.getHttpOption(hasAuth);
        try {
            return this.httpClient.post<any>(fullUrl, data, this.httpOption).pipe(
                map((resp: any) => resp),
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
                map((resp: any) => resp),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public put(url: string, data: any, hasAuth: boolean = true): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl() + url;
        this.httpOption = this.getHttpOption(hasAuth);
        try {
            return this.httpClient.put<any>(fullUrl, data, this.httpOption).pipe(
                map((resp: any) => resp),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    public delete(url: string, hasAuth: boolean = true): Observable<HttpResponse<any>> {
        const fullUrl: string = this.getApiUrl() + url;
        this.httpOption = this.getHttpOption(hasAuth);
        try {
            return this.httpClient.delete(fullUrl, this.httpOption).pipe(
                map((resp: any) => resp),
                catchError(error => this.handleError(error))
            );
        } catch (err) {
            throw new Error(err);
        }
    }

    private getHttpOption(hasAuth: boolean, obj?, responseType?) {
        const httpOption = {
            headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': ['application/json'],
                    'Access-Control-Allow-Origin': '*'
                },
            ),
            params: new HttpParams(),
            responseType: responseType
        };
        if (hasAuth) {
            httpOption.headers = httpOption.headers.set('token', this.localStorageService.getItem(appConfig.CACHE_AUTH_TOKEN));
            httpOption.headers = httpOption.headers.set('csid', '1');
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
        return httpOption;
    }

}
