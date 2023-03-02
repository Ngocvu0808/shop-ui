import {app_config} from './app-config';

export const environment = {
    production: true,
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
