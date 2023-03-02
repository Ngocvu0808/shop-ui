// Angular
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
// RxJS
// Translate
import {TranslateService} from '@ngx-translate/core';
// Store
import {Store} from '@ngrx/store';
import {AppState} from '../../../../core/reducers';
// Auth
import {AuthenticateService} from '../../../../service/auth.service';
import appConfig from '../../../../core/_common/config/appConfig';
import {LocalStorageService} from '../../../../core/_common/cache-service/local-storage.service';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'kt-callback',
    templateUrl: './callback.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CallbackComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private translate: TranslateService,
        private store: Store<AppState>,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private authService: AuthenticateService,
        private storageService: LocalStorageService
    ) {
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe(params => {
            const code = params.code;
            const JWT = params.jwt;
            const state = params.state;
            if (code == null || code == '') {
                // redirect to login pages
                window.location.replace(`${environment.AUTH_LOGIN_PAGE}?state=${state}&returnUrl=${window.location.origin}/auth/callback`);
            }
            this.storageService.setItem(appConfig.CACHE_AUTH_TOKEN, code);
            this.storageService.setItem(appConfig.JWT, JWT);
            // check token is valid
            this.authService.checkPermission().subscribe(res => {
                if (res) {
                    if (res.status) {
                        const token = res.data.token;
                        const jwt = res.data.jwt;
                        // save to local cache
                        this.storageService.setItem(appConfig.CACHE_AUTH_TOKEN, token);
                        this.storageService.setItem(appConfig.JWT, jwt);
                        this.router.navigateByUrl(`${state}`);
                    } else {
                        this.storageService.clearAll();
                        window.location.replace(`${environment.AUTH_LOGIN_PAGE}?state=${state}&returnUrl=${window.location.origin}/auth/callback`);
                    }
                }
            });
        });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }
}
