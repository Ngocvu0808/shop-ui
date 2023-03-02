// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {app_config} from './app-config';

export const environment = {
    production: false,
    isMockEnabled: false, // You have to switch this, when your real back-end is done
    API_URL: app_config.API_URL,
    AUTH_LOGIN_PAGE: app_config.AUTH_LOGIN_PAGE,
    CACHE_AUTH_TOKEN: 'authToken',
    CACHE_USER_INFO: 'userInfo',

    // account
    username: 'test',
    password: '1qazXSW@2020',

    // AUTH
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    CHECK_PERMISSION: '/auth/check',
    VALIDATE_TOKEN: '/auth/validate',
    REFRESH_PERMISSION: '/auth/refresh',

    PUBLIC_KEY: app_config.PUBLIC_KEY,
    PRIVATE_KEY: app_config.PRIVATE_KEY,
    SYSTEM_NAVIGATORS: '/config/system-navigators',
    // GROUP
    GROUP_USER_ADD: '/auth/group',
    GROUP_USER_UPDATE: '/auth/group/:id',
    GROUP_USER_DELETE: '/auth/group/:id',
    GROUP_USER_GET_BY_ID: '/auth/group/:id',
    GROUP_USER_GET_ALL: '/auth/groups',
    GROUP_USER_ADD_USER: '/auth/group/user',
    GROUP_USER_DELETE_USER: '/auth/group/:id/member/:idUserDelete',
    GROUP_USER_UPDATE_ROLE: '/auth/group/role',
    GROUP_USER_DELETE_ROLE: '/auth/group/:id/role/:roleId',
    GROUP_USER_GET_ALL_USER: '/auth/group/:id/user',
    GROUP_USER_GET_ALL_ROLE: '/auth/group/:id/roles',
    GROUP_ROLE_FILTER: '/auth/groups/roles',
    GROUP_USER_ADD_USERS: '/auth/group/:id/members',

    USER_ADD: '/auth/user/',
    USER_DELETE: '/auth/user/:id',
    USER_GET_ROLES: '/auth/user/:id/roles',
    USER_ADD_ROLES: '/auth/user/:id/roles',
    USER_DELETE_ROLES: '/auth/user/:id/roles',
    USER_UPDATE_ROLES: '/auth/user/:id/roles',
    USER_GET_BY_ID: '/auth/user/:id',
    USER_GET_ALL: '/auth/users',
    USER_UPDATE: '/auth/user/',
    GET_USER_GROUP_LIST: '/auth/user/user-and-group',
    USER_ENABLE: '/auth/user/:id/enable',
    USER_DISABLE: '/auth/user/:id/disable',
    USER_UPDATE_STATUS_LIST: '/auth/users/status/',
    USER_UPDATE_STATUS_ALL: '/auth/users/status/all',
    USER_DELETE_LIST: '/auth/users/delete/',
    USER_DELETE_ALL: '/auth/users/',
    USER_GET_ROLES_ASSIGNED: '/auth/users/roles',
    USER_GET_GROUPS_ASSIGNED: '/auth/users/groups',
    USER_GET_LIST_STATUS: '/auth/user/status',
    USER_CHANGE_PASS: '/auth/change-pass',
    USER_RESET_PASS: '/auth/user/:id/reset-pass',
    USER_GET_EXIST_KEY: '/auth/api-key',
    USER_API_KEY_RELOAD: '/auth/api-key/reload',
    USER_API_KEY_GENERATE: '/auth/api-key-generate',

    ROLE_ADD: '/auth/role/',
    ROLE_GET_BY_ID: '/auth/role/:id',
    ROLE_UPDATE: '/auth/role/:id',
    ROLE_DELETE: '/auth/role/:id',
    ROLE_GET_ALL_PERMISSION: '/auth/role/permissions',
    ROLE_GET_ALL: '/auth/roles', //Paging
    ROLE_GET_ALL_ACTIVE: '/auth/role/',
    ROLE_GET_ALL_FILTER: '/auth/role',
    ROLE_GET_TYPE: '/auth/role/type/filter',

    USER_GET_CURRENT_API_KEY: '/auth/api-key',
    APP_GET_ALL: '/auth/apps',
    APP_GET_BY_ID: '/auth/app/:id',
    APP_ADD: '/auth/app',
    APP_DELETE_BY_ID: '/auth/app/:id',
    APP_UPDATE_STATUS_BY_ID: '/auth/app/:id/status',
    APP_ADD_IP_WHITE_LIST: '/auth/app/:id/wl',
    APP_DELETE_IP_WHITE_LIST: '/auth/app/:id/wl',
    APP_GET_LIST_IP_WHITE_LIST: '/auth/app/:id/wls',
    APP_GET_LIST_REFRESH_TOKEN: '/auth/app/:id/refresh-tokens',
    APP_APPROVE_REFRESH_TOKEN: '/auth/token/:id/approve',
    APP_UNAPPROVE_REFRESH_TOKEN: '/auth/token/:id/un-approve',
    APP_DELETE_REFRESH_TOKEN: '/auth/token/:id',
    APP_UPDATE_STATUS_TOKEN: '/auth/token/:id/status',
    APP_UPDATE: '/auth/app/:id',
    APP_GET_LIST_TOKEN: '/auth/tokens',
    APP_GET_STATUS_ACCESS_TOKEN: '/auth/access-token/status',
    APP_GET_ROLE_FILTER: '/auth/app/:id/roles',

    APP_GET_LIST_USER: '/auth/app/:id/users',
    APP_ADD_USER: '/auth/app/:id/user',
    APP_UPDATE_USER: '/auth/app/:id/user/:userId',
    APP_DELETE_USER: '/auth/app/:id/user/:userId',
    APP_SERVICE_GET_LIST_API: '/auth/app/:id/service/:serviceId/apis',
    APP_GET_LIST_SERVICE: '/auth/app/:id/services',
    APP_SERVICE_GET_DETAIL: '/auth/app/:id/service/:serviceId',
    APP_CANCEL_SERVICE: '/auth/app/:id/service/:serviceId',
    APP_REMOVE_SERVICE: '/auth/app/:id/service/:serviceId',
    APP_REGIST_API: '/auth/app/:id/api',
    APP_UNREGIST_API: '/auth/app/:id/api/:api_id',

    SERVICE_GET_SYSTEMS: '/auth/service/systems',
    SERVICE_GET_TAGS: '/auth/service/tags',
    SERVICE_GET_API_TYPES: '/auth/service/api-types',
    SERVICE_GET_API_METHODS: '/auth/service/api-methods',
    SERVICE_GET_API_STATUS: '/auth/service/api-status',
    SERVICE_GET_API_REQUEST_STATUS: '/auth/service/api-request/status',
    SERVICE_GET_SERVICE_NOT_SETTING: '/auth/app/:id/service-not-setting',
    SERVICE_ADD: '/auth/service',
    SERVICE_UPDATE: '/auth/service/:id',
    SERVICE_DELETE: '/auth/service/:id',
    SERVICE_GET_ALL: '/auth/services',
    SERVICE_GET_BY_ID: '/auth/service/:id',
    SERVICE_GET_ALL_NO_PAGING: '/auth/service/all',
    SERVICE_UPDATE_STATUS: '/auth/service/:id/status',
    SERVICE_API_ADD: '/auth/service/api',
    SERVICE_API_GET_BY_ID: '/auth/service/api/:id',
    SERVICE_API_UPDATE_STATUS: '/auth/service/api/:id/status',
    SERVICE_API_UPDATE: '/auth/service/api/:id',
    SERVICE_API_DELETE: '/auth/service/api/:id',
    SERVICE_API_GET_ALL: '/auth/service/apis',
    SERVICE_API_REQUEST_GET_ALL: '/auth/service/api-requests',
    SERVICE_API_REQUEST_GET_BY_ID: '/auth/service/api-request/:id',
    SERVICE_API_REQUEST_UPDATE: '/auth/service/api-request/:id',
    SERVICE_API_REQUEST_DELETE: '/auth/service/api-request/:id',

    ACCESSTOKEN_GET_ALL: '/auth/app/:id/access-tokens',
    ACCESSTOKEN_CHANGE_STATUS: '/auth/app/access-token/:id/status',

    LOG_HISTORY_GET_ALL: '/auth/app/:id/request-logs',
    LOG_HISTORY_EXPORT_FILE: '/auth/app/:id/request-log/export',
    LOG_HISTORY_DETAIL: '/auth/app/request-log/:id',

    SERVICE_REGISTER_CREATE: '/auth/app/:id/api',

    SERVICE_ADD_GET_ALL: '/auth/services',
    SERVICE_ADD_SETTING: '/auth/app/:id/service',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
