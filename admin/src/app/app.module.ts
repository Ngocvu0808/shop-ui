

registerLocaleData(en);// Angular
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule,} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GestureConfig, MatPaginatorIntl, MatPaginatorModule, MatProgressSpinnerModule} from '@angular/material';
import {OverlayModule} from '@angular/cdk/overlay';
// Perfect Scroll bar
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
// SVG inline
import {InlineSVGModule} from 'ng-inline-svg';
// Hammer JS
import 'hammerjs';
// NGX Permissions
import {NgxPermissionsModule} from 'ngx-permissions';
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
// State
import {metaReducers, reducers} from './core/reducers';
// Components
import {AppComponent} from './app.component';
// Modules
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {ThemeModule} from './views/theme/theme.module';
// Partials
import {PartialsModule} from './views/partials/partials.module';
// Layout Services
import {
	DataTableService,
	KtDialogService,
	LayoutConfigService,
	LayoutRefService,
	MenuAsideService,
	MenuConfigService,
	MenuHorizontalService,
	PageConfigService,
	SplashScreenService,
	SubheaderService
} from './core/_base/layout';
// Auth
import {AuthModule} from './views/pages/auth/auth.module';
// CRUD
import {HttpUtilsService, LayoutUtilsService, TypesUtilsService} from './core/_base/crud';
// Config
import {LayoutConfig} from './core/_config/layout.config';
// Highlight JS
import {HIGHLIGHT_OPTIONS, HighlightLanguage} from 'ngx-highlightjs';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as xml from 'highlight.js/lib/languages/xml';
import * as json from 'highlight.js/lib/languages/json';
import {ToastrModule} from 'ng6-toastr-notifications';
import {CustomMatPaginatorIntl} from './core/_common/helper/PaginatorHelper';
import {StylePaginatorDirective} from './shared/paging/StylePaginatorDirective';
import {DatePipe, registerLocaleData} from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import en from '@angular/common/locales/en';
// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	wheelSpeed: 0.5,
	swipeEasing: true,
	minScrollbarLength: 40,
	maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
	// initialize app by loading default demo layout config
	return () => {
		if (appConfig.getConfig() === null) {
			appConfig.loadConfigs(new LayoutConfig().configs);
		}
	};
}

export function hljsLanguages(): HighlightLanguage[] {
	return [
		{name: 'typescript', func: typescript},
		{name: 'scss', func: scss},
		{name: 'xml', func: xml},
		{name: 'json', func: json}
	];
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		// environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
		// 	passThruUnknownUrl: true,
		// 	dataEncapsulation: false
		// }) : [],
		NgxPermissionsModule.forRoot(),
		PartialsModule,
		CoreModule,
		OverlayModule,
		StoreModule.forRoot(reducers, {metaReducers}),
		EffectsModule.forRoot([]),
		StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
		StoreDevtoolsModule.instrument(),
		AuthModule.forRoot(),
		TranslateModule.forRoot(),
		MatProgressSpinnerModule,
		InlineSVGModule.forRoot(),
		ToastrModule.forRoot(),
		ThemeModule,
		MatPaginatorModule,
		NgZorroAntdModule,
		FormsModule,
	],
	exports: [],
	providers: [
		LayoutConfigService,
		LayoutRefService,
		MenuConfigService,
		PageConfigService,
		KtDialogService,
		DataTableService,
		StylePaginatorDirective,
		SplashScreenService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: GestureConfig
		},
		{
			// layout config initializer
			provide: APP_INITIALIZER,
			useFactory: initializeLayoutConfig,
			deps: [LayoutConfigService], multi: true
		},
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: {languages: hljsLanguages}
		},
		{
			provide: MatPaginatorIntl,
			useClass: CustomMatPaginatorIntl
		},
		DatePipe,
		// template services
		SubheaderService,
		MenuHorizontalService,
		MenuAsideService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		{ provide: NZ_I18N, useValue: en_US }
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
