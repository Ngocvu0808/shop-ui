// Angular
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// RxJS
import {Subject} from 'rxjs';
import {SimpleAuthService} from '../../../../service/auth.service';
import appConfig from '../../../../core/_common/config/appConfig';
import {LocalStorageService} from '../../../../core/_common/cache-service/local-storage.service';
import {app_config} from '../../../../../environments/app-config';
import {NotifyService} from '../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {HelperService} from '../../../../core/_common/helper/helper.service';
import {DetectChangeLocalStorageService} from '../../../../core/_common/cache-service/detect-change-local-storage.service';
import {CryptoService} from '../../../../core/_common/helper/crypto.service';

@Component({
    selector: 'kt-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup;
    loading = false;
    errors: any = [];

    private unsubscribe: Subject<any>;

    private returnUrl: any = '';
    private state: any = '';
    includeCode: boolean = true;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: SimpleAuthService,
        private localStorageService: LocalStorageService,
        private storage: DetectChangeLocalStorageService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private helperService: HelperService,
        private cryptoService: CryptoService
    ) {
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
    }


    /**
     * On init
     */
    ngOnInit(): void {
        this.detectChange();
        // this.checkLogged();
        this.initLoginForm();
    }

    detectChange() {
        const params = {
            state: (this.state == undefined || this.state == '') ? app_config.STATE : this.state
        };
        if (this.includeCode) {
            params['code'] = this.localStorageService.getItem(appConfig.CACHE_AUTH_TOKEN);
        }
        this.storage.changes.subscribe(res => {
            if (this.localStorageService.isExist(appConfig.CACHE_AUTH_TOKEN)) {
                window.location.replace(this.helperService.generateUrl(this.returnUrl, params));
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }

    checkLogged() {
        if (!this.localStorageService.isExist(appConfig.CACHE_AUTH_TOKEN)) {
            return;
        }
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
                    return;
                }
            }
        });
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initLoginForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(320)
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ])]
        });
    }

    /**
     * Form Submit
     */
    submit() {
        // window.location.assign('sms://+9396?body=V');
        const controls = this.loginForm.controls;
        /** check form */
        if (this.loginForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        this.loading = true;

        const authData = {
            username: controls.username.value.toString().trim(),
            password: this.cryptoService.encrypt(controls.password.value.toString().trim())
        };
        this.authService.login(authData.username, authData.password).subscribe(res => {
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
                    this.notifyService.notify('ERROR', '', this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'));
                    this.loading = false;
                }
            }
        });
        this.loading = false;
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.loginForm.controls[controlName];
        if (!control) {
            return false;
        }

        return control.hasError(validationType) && (control.dirty || control.touched);
    }
}
