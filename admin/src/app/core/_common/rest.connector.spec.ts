import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpErrorResponse, HttpHandler, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';

import {LocalStorageService} from './cache-service/local-storage.service';
import {NotifyService} from '../../service/notify.service';
import {RestConnector} from './rest.connector';

import {environment} from '../../../environments/environment.test';

interface HttpClientSpy {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    delete: jasmine.Spy;
}

interface Error {
    code: number;
    message: string;
}

class NotifyServiceStub {
    notify(action, str, str2) {
        return true;
    }
}

describe('http client testing', () => {
    let localStorageService: LocalStorageService;
    let notifyService: NotifyService;
    let restConnector: RestConnector;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let httpClientSpy: HttpClientSpy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                RestConnector,
                LocalStorageService,
                HttpHandler,
                HttpClient,
                {provide: NotifyService, useValue: NotifyServiceStub},
            ],
        });

        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
        localStorageService = TestBed.get(LocalStorageService);
        notifyService = TestBed.get(NotifyService);
        httpClient = TestBed.get(HttpClient);

        // restConnector = new RestConnector(httpClient, localStorageService, notifyService);

        restConnector = new RestConnector(httpClientSpy as any, localStorageService, notifyService);
    });

    it('restConnector should be injected', () => {
        expect(restConnector).toBeTruthy();
    });

    describe('#get', () => {
        const url = environment.USER_GET_ALL;
        it('when server responds with data', () => {
            const testData = new HttpResponse({body: {id: 1}});
            // const testRequest = new HttpRequest('GET', url, { headers: { 'token': 'token' } });

            httpClientSpy.get.and.returnValue(of(testData));

            restConnector.get(url).subscribe(data => expect(data).toEqual(testData), fail);

            expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        });

        describe('when server responds with error', () => {
            let errorResponse: HttpErrorResponse;

            function errorResponseMock(error: ErrorEvent | any) {
                return new HttpErrorResponse({
                    error: error,
                    status: 404,
                    statusText: 'Not Found',
                });
            }

            describe('when error.error is an intance of ErrorEvent', () => {
                errorResponse = errorResponseMock(new ErrorEvent('404'));

                it('should throw an error observable', () => {
                    httpClientSpy.get.and.returnValue(throwError(errorResponse));

                    restConnector.get(url).subscribe(
                        () => fail('expect error 404'),
                        error => {
                            expect(error).toEqual(errorResponse);
                        }
                    );
                });
            });

            describe('when error.error is not an instance of ErrorEvent', () => {
            });
        });
    });

    describe('#getByUrl', () => {
        const url = environment.USER_GET_ALL;
        it('when server responds with data', () => {
            const testData = new HttpResponse({body: {id: 1}});

            httpClientSpy.get.and.returnValue(of(testData));

            restConnector.get(url).subscribe(data => expect(data).toEqual(testData), fail);

            expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        });

        it('when server responds with error', () => {
            const errorResponse = new HttpErrorResponse({
                error: 'test 404 error',
                status: 404,
                statusText: 'Not Found',
            });

            httpClientSpy.get.and.returnValue(null);

            restConnector.get(url).subscribe(
                () => fail('expect error 404'),
                error => {
                    expect(error.message).toContain('test 404 error');
                }
            );
        });
    });

    describe('#post', () => {
        const url = environment.GROUP_USER_ADD;
        const testInputData = {id: 1};

        it('when server responds with data', () => {
            const testData = new HttpResponse({body: {id: 1}});

            httpClientSpy.post.and.returnValue(of(testData));

            restConnector.post(url, testInputData).subscribe(data => expect(data).toEqual(testData), fail);

            expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
        });

        it('when server responds with error', () => {
        });
    });

    describe('#postUrl', () => {
        const url = environment.GROUP_USER_ADD;
        const testInputData = {id: 1};

        it('when server responds with data', () => {
            const testData = new HttpResponse({body: {id: 1}});

            httpClientSpy.post.and.returnValue(of(testData));

            restConnector.post(url, testInputData).subscribe(data => expect(data).toEqual(testData), fail);

            expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
        });

        it('when server responds with error', () => {
        });
    });

    describe('#put', () => {
        const url = environment.GROUP_USER_UPDATE.toString().replace(':id', '1');
        const testInputData = {id: 1};

        it('when server responds with data', () => {
            const testData = new HttpResponse({body: {id: 1}});

            httpClientSpy.put.and.returnValue(of(testData));

            restConnector.put(url, testInputData).subscribe(data => expect(data).toEqual(testData), fail);

            expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
        });

        it('when server responds with error', () => {
        });
    });

    describe('#delete', () => {
        const url = environment.GROUP_USER_DELETE.toString().replace(':id', '1');

        it('when server responds with data', () => {
            const testData = new HttpResponse({body: {id: 1}});

            httpClientSpy.delete.and.returnValue(of(testData));

            restConnector.delete(url).subscribe(data => expect(data).toEqual(testData), fail);

            expect(httpClientSpy.delete.calls.count()).toBe(1, 'one call');
        });

        it('when server responds with error', () => {
        });
    });

    describe('#exportFile', () => {
        const url = environment.LOG_HISTORY_EXPORT_FILE.toString().replace(':id', '1');
        it('when server responds with data', () => {
            const testData = new File([''], 'filename', {type: 'text/html'});

            httpClientSpy.get.and.returnValue(of(testData));

            restConnector.exportFile(url).subscribe(data => expect(data).toEqual(testData), fail);

            expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        });

        it('when server responds with error', () => {
        });
    });
});
