// Angular
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// RxJS
import {Observable, Subject} from 'rxjs';
// Translate
import {TranslateService} from '@ngx-translate/core';
// Store
import {Store} from '@ngrx/store';
import {AppState} from '../../../../core/reducers';
// Auth
// import {AuthNoticeService, AuthService} from '../../../../core/auth';
import {AuthenticateService} from '../../../../service/auth.service';
import appConfig from '../../../../core/_common/config/appConfig';
import {LocalStorageService} from '../../../../core/_common/cache-service/local-storage.service';
import {NotifyService} from '../../../../service/notify.service';

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
    USERNAME: 'test',
    PASSWORD: '12345678'
};

@Component({
    selector: 'kt-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup;
    loading = false;
    isLoggedIn$: Observable<boolean>;
    errors: any = [];

    private unsubscribe: Subject<any>;

    private returnUrl: any;

    // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    /**
     * Component constructor
     *
     * @param router: Router
     * @param auth: AuthService
     * @param notifyService
     * @param authNoticeService: AuthNoticeService
     * @param translate: TranslateService
     * @param store: Store<AppState>
     * @param fb: FormBuilder
     * @param cdr
     * @param route
     * @param authService
     * @param storageService
     */
    constructor(
        private router: Router,
        // private auth: AuthService,
        private notifyService: NotifyService,
        // private authNoticeService: AuthNoticeService,
        private translate: TranslateService,
        private store: Store<AppState>,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private authService: AuthenticateService,
        private storageService: LocalStorageService
    ) {
        this.unsubscribe = new Subject();
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
        this.initLoginForm();

        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params.returnUrl || '/';
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // this.authNoticeService.setNotice(null);
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initLoginForm() {
        // demo message to show
        // if (!this.authNoticeService.onNoticeChanged$.getValue()) {
        // 	const initialNotice = `Use account
        // 	<strong>${DEMO_PARAMS.USERNAME}</strong> and password
        // 	<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
        // 	this.authNoticeService.setNotice(initialNotice, 'info');
        // }

        this.loginForm = this.fb.group({
            username: [DEMO_PARAMS.USERNAME, Validators.compose([
                Validators.required,
                // Validators.email,
                Validators.minLength(3),
                Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
            ])
            ],
            password: [DEMO_PARAMS.PASSWORD, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ])
            ]
        });
    }

    /**
     * Form Submit
     */
    submit() {
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
            username: controls.username.value,
            password: controls.password.value
        };
        try {
            this.authService.login(authData.username, authData.password).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.storageService.setItem(appConfig.CACHE_AUTH_TOKEN, res.data.token);
                        this.storageService.setItem(appConfig.JWT, res.data.jwt);
                        // this.saveUserInfoIntoCache(res.data.jwt);
                        this.router.navigateByUrl(this.returnUrl); // Main pages
                    } else {
                        this.notifyService.notify('ERROR', '', this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'));
                        this.loading = false;
                        this.cdr.markForCheck();
                    }
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    // saveUserInfoIntoCache(token: string) {
    // 	const helper = new JwtHelperService();
    // 	const decodedToken = helper.decodeToken(token);
    // 	this.storageService.setItem(appConfig.CACHE_USER_INFO, decodedToken);
    // }

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

        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
    }
}
