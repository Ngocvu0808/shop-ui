// Angular
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
// RxJS
import {SimpleAuthService} from '../../../../service/auth.service';
import appConfig from '../../../../core/_common/config/appConfig';
import {LocalStorageService} from '../../../../core/_common/cache-service/local-storage.service';
import {HelperService} from '../../../../core/_common/helper/helper.service';
import {app_config} from '../../../../../environments/app-config';

@Component({
    selector: 'kt-login',
    templateUrl: './check-login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CheckLoginComponent implements OnInit, OnDestroy {
    private returnUrl: any;
    private state: any;
    private loginUrl: any = '';
    includeCode: boolean = true;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private authService: SimpleAuthService,
        private localStorageService: LocalStorageService,
        private helperService: HelperService
    ) {
    }


    /**
     * On init
     */
    ngOnInit(): void {
        this.loginUrl = `${window.location.origin}/auth/login`;
        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params.returnUrl;
            this.state = params.state;
            if (this.returnUrl == undefined || this.returnUrl == '') {
                this.returnUrl = app_config.RETURN_URL;
                this.includeCode = false;
            }
            if (this.state == undefined || this.state == '') {
                this.state = app_config.STATE;
            }
        });
        this.checkLogged();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }


    checkLogged() {
        if (!this.localStorageService.isExist(appConfig.CACHE_AUTH_TOKEN)) {
            window.location.replace(this.helperService.generateUrl(this.loginUrl, {
                state: this.state,
                returnUrl: this.returnUrl
            }));
            return;
        }
        try {
            this.authService.checkLogin().subscribe(res => {
                if (res) {
                    if (res.status) {
                        const token = res.data.token;
                        const jwt = res.data.jwt;
                        this.localStorageService.setItem(appConfig.CACHE_AUTH_TOKEN, token);
                        this.localStorageService.setItem(appConfig.JWT, jwt);
                        const params = {
                            state: (this.state == undefined || this.state == '') ? app_config.STATE : this.state
                        };
                        if (this.includeCode) {
                            params['code'] = token;
                        }
                        window.location.replace(this.helperService.generateUrl(this.returnUrl, params));
                        return;
                    } else {
                        this.localStorageService.clearAll();
                        window.location.replace(this.helperService.generateUrl(this.loginUrl, {
                            state: this.state,
                            returnUrl: this.returnUrl
                        }));
                    }
                }
            });
        } catch (e) {
            window.location.replace(this.helperService.generateUrl(this.loginUrl, {
                state: this.state,
                returnUrl: this.returnUrl
            }));
        }
    }

}
