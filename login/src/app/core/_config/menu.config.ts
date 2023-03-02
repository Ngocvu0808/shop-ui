export class MenuConfig {
    public defaults: any = {
        header: {
            self: {},
            items: [
                {
                    title: 'Shorten link',
                    root: true,
                    alignment: 'left',
                    page: '/shortenlink/create',
                    translate: 'MENU.SHORTEN_LINK',
                },
                {
                    title: 'Manage Link',
                    root: true,
                    alignment: 'left',
                    page: '/shortenlink/list',
                    translate: 'MENU.MANAGE_LINK',

                },
                {
                    title: 'Reports',
                    root: true,
                    alignment: 'left',
                    // toggle: 'click',
                    page: '/shortenlink/reports',
                    translate: 'MENU.REPORTS',
                },
            ]
        },
    };

    public get configs(): any {
        return this.defaults;
    }
}
