export class MenuConfig {
    public defaults: any = {
        header: {
            self: {},
            items: [
                {
                    title: 'Service',
                    root: true,
                    alignment: 'left',
                    toggle: 'click',
                    translate: 'MENU.SERVICE',
                    submenu: [
                        {
                            title: 'Service',
                            bullet: 'dot',
                            icon: 'flaticon2-dashboard',
                            page: '/service/list'
                        },
                        {
                            title: 'APIs',
                            bullet: 'dot',
                            icon: 'flaticon2-user',
                            page: '/api/list'
                        },
                        {
                            title: 'API request',
                            bullet: 'dot',
                            icon: 'flaticon2-user-1',
                            page: '/api-request/list'
                        },
                    ]
                },
                {
                    title: 'User',
                    root: true,
                    alignment: 'left',
                    toggle: 'click',
                    translate: 'MENU.USER',
                    submenu: [
                        {
                            title: 'Vai trò',
                            bullet: 'dot',
                            icon: 'flaticon2-dashboard',
                            page: '/role/list'
                        },
                        {
                            title: 'Người dùng',
                            bullet: 'dot',
                            icon: 'flaticon2-user',
                            page: '/user/list'
                        },
                    ]
                },
                {
                    title: 'Application',
                    root: true,
                    alignment: 'left',
                    toggle: 'click',
                    translate: 'MENU.APPLICATION',
                    page: '/application/app',
                },
                {
                    title: 'Shop',
                    root: true,
                    alignment: 'left',
                    toggle: 'click',
                    translate: 'MENU.BUSINESS',
                    submenu: [
                        {
                            title: 'Trang bán hàng',
                            bullet: 'dot',
                            icon: 'flaticon2-start-up',
                            page: '/product/list',
                        },
                        {
                            title: 'Trang quản lý',
                            bullet: 'dot',
                            icon: 'flaticon2-information',
                            page: '/business/trading',
                        },
                        {
                            title: 'Tạo đơn hàng',
                            bullet: 'dot',
                            icon: 'flaticon2-medical-records',
                            page: '/business/sell',
                        }
                    ]
                }
            ]
        },
    };

    public get configs(): any {
        return this.defaults;
    }
}
