// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {app_config} from './app-config';

export const environment = {
    production: false,
    isMockEnabled: true, // You have to switch this, when your real back-end is done
    API_URL: app_config.API_URL,
    CACHE_AUTH_TOKEN: 'authToken',
    CACHE_USER_INFO: 'userInfo',

    // AUTH
    LOGIN: '/auth/login',
    CHECK_PERMISSION: '/auth/check',

    PUBLIC_KEY: app_config.PUBLIC_KEY,
    PRIVATE_KEY: app_config.PRIVATE_KEY
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
