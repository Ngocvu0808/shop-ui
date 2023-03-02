import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { NotifyService } from '../../../../../service/notify.service';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../../../core/_common/permission.service';
import { ServiceAddComponent } from '../service-add/service-add.component';
import { ServiceRegisterComponent } from '../service-register/service-register.component';
import { ApplicationService } from '../../../../../service/application.service';

@Component({
    selector: 'mar-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit, OnChanges {
    displayedColumns: string[] = ['name', 'api', 'method', 'type', 'description', 'status', 'actions'];
    dataSource = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    filterText: any = '';
    searchValue: string = '';
    listService: any;
    appId: any;
    serviceId: any;
    serviceIdSelected: any;
    serviceStatus: any;
    serviceDetail: any;
    dataSearchApi = [];
    statusValue: any;
    // sort
    sortActive = '';
    sortDirection = '';

    @Input() status: any = '';
    @Input() isActiveTab: number;
    loadingListService: boolean = false;
    loadingServiceDetail: boolean = false;
    loadingApiList: boolean = false;

    constructor(public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private appService: ApplicationService,
        private layoutUtilsService: LayoutUtilsService,
        private fb: FormBuilder,
        public cdr: ChangeDetectorRef,
        private router: Router,
        private notifyService: NotifyService,
        private permissionService: PermissionService,
        private route: ActivatedRoute) {
        this.appId = this.route.snapshot.paramMap.get('id');
        this.statusValue = '';
    }

    ngOnChanges() {
        if (this.isActiveTab == 5) {
            this.getListService();
        }
    }

    ngOnInit() {
    }

    //bỏ dấu tiếng việt
    change_alias(alias) {
        let str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
        str = str.replace(/ + /g, ' ');
        str = str.trim();
        return str;
    }

    search() {
        const search = this.change_alias(this.searchValue.toLowerCase());
        if (search != '') {
            this.filterByStatus();
            this.dataSearchApi = this.dataSearchApi.filter((data) => {
                return (this.change_alias(data.name.toLowerCase()).indexOf(search) != -1
                    || this.change_alias(data.api.toLowerCase()).indexOf(search) != -1
                    || this.change_alias(data.method.toLowerCase()).indexOf(search) != -1
                    || this.change_alias(data.type.toLowerCase()).indexOf(search) != -1);
            });
        }
        else {
            this.filterByStatus();
        }
    }

    filterByStatus() {
        switch (this.statusValue) {
            case '':
                this.dataSearchApi = this.dataSource;
                break;
            case 'null':
                this.dataSearchApi = this.dataSource.filter(it => it.status === null);
                break;
            case 'ACTIVE':
                this.dataSearchApi = this.dataSource.filter(it => it.status == 'ACTIVE');
                break;
            case 'DEACTIVE':
                this.dataSearchApi = this.dataSource.filter(it => it.status == 'DEACTIVE');
                break;
        }
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

    fetchData() {
        this.getListApi();
    }

    viewDetailService(id) {
        this.serviceIdSelected = id;
        this.getListApi();
        this.getListService();
    }

    getListService() {
        this.loadingListService = true;
        this.appService.getListService(this.appId).subscribe(res => {
            if (res) {
                if (res.status) {
                    this.loadingListService = false;
                    this.listService = res.data;
                    if (!this.serviceIdSelected && this.listService.length > 0) {
                        this.serviceIdSelected = this.listService[0].id;
                    }
                    this.fetchData();
                    this.getServiceDetail();
                    this.cdr.markForCheck();
                }
            }
        });
    }

    getServiceDetail() {
        if (!this.serviceIdSelected) {
            return;
        }
        const params = {
            id: this.appId,
            serviceId: this.serviceIdSelected,
        };
        this.loadingServiceDetail = true;
        this.appService.getServiceDetail(params).subscribe(res => {
            if (res) {
                if (res.status) {
                    this.serviceDetail = res.data;
                    this.loadingServiceDetail = false;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    getListApi() {
        if (!this.serviceIdSelected) {
            return;
        }
        const params = {
            id: this.appId,
            serviceId: this.serviceIdSelected
        };
        this.loadingApiList = true;
        this.appService.getListApi(params).subscribe(res => {
            if (res) {
                if (res.status) {
                    const data = res.data;
                    data.forEach((it) => {
                        it['actions'] = '';
                    });
                    this.dataSource = data;
                    this.dataSearchApi = data;
                    this.loadingApiList = false;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    getDisplayStatus(status: any) {
        switch (status) {
            case 'ACTIVE':
                return 'Đã đăng ký';
                break;
            case 'DEACTIVE':
                return 'Chờ duyệt';
                break;
            case null:
                return 'Chưa đăng ký';
                break;
            default:
                return 'Chưa đăng ký';
                break;
        }
    }

    // deleteApp(element: any) {
    //     const _title: string = this.translate.instant('APP.DELETE.TITLE');
    //     const _description: string = this.translate.instant('APP.DELETE.CONTENT', {name: element.name});
    //     const _waitDescription: string = this.translate.instant('COMMON.DELETING');
    //     const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
    //     dialogRef.afterClosed().subscribe(res => {
    //         if (!res) {
    //             return;
    //         }
    //         try {
    //             this.appService.delete(element.id).subscribe(res => {
    //                 if (res) {
    //                     if (res.status) {
    //                         this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.DELETE_SUCCESS'));
    //                         // this.getAll(this.pages + 1, this.limit);
    //                         return;
    //                     }
    //                     if (res.httpCode != 403) {
    //                         this.notifyService.notify('WARN', '', res.message);
    //                     }
    //                 }
    //             });
    //         } catch (e) {
    //             this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
    //         }
    //     });
    // }

    removeServiceApp() {
        const _title: string = this.translate.instant('Gỡ dịch vụ');
        const _description: string = this.translate.instant('Xác nhận gỡ dịch vụ ' + this.serviceDetail.name);
        const _waitDescription: string = this.translate.instant('Đang gỡ');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        const params = {
            id: this.appId,
            serviceId: this.serviceIdSelected,
        };
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.removeService(params).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.getListService();
                            this.serviceIdSelected = '';
                            this.notifyService.notify('SUCCESS', '', 'Gỡ thành công');
                            this.cdr.markForCheck();
                            return;
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            }
        });
    }

    cancelServiceApp() {
        const _title: string = this.translate.instant('Hủy dịch vụ');
        const _description: string = this.translate.instant('Xác nhận hủy dịch vụ ' + this.serviceDetail.name);
        const _waitDescription: string = this.translate.instant('Đang hủy');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        const params = {
            id: this.appId,
            serviceId: this.serviceIdSelected,
        };
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.cancelService(params).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.getListService();
                            this.serviceIdSelected = '';
                            this.notifyService.notify('SUCCESS', '', 'Hủy thành công');
                            this.cdr.markForCheck();
                            return;
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            }
        });
    }

    add() {
        const dialogRef = this.dialog.open(ServiceAddComponent, {
            data: { appID: this.appId, listService: this.listService },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                this.getListService();
                this.fetchData();
                return;
            }
        });
    }

    register(item) {
        item['appID'] = this.appId;
        const dialogRef = this.dialog.open(ServiceRegisterComponent, { data: { item }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    unRegister(item) {
        const _title: string = this.translate.instant('APP.SERVICE.UN_REGISTER.TITLE');
        const _description: string = this.translate.instant('APP.SERVICE.UN_REGISTER.DESCRIPTION');
        const _waitDescription: string = this.translate.instant('APP.SERVICE.UN_REGISTER.WAIT_DESCRIPTION');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        const params = {
            id: this.appId,
            api_id: item.id,
        };
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.removeApi(params).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.getListApi();
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('APP.SERVICE.UN_REGISTER.SUCCESS_MESSAGE'));
                            this.cdr.markForCheck();
                            return;
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('APP.SERVICE.UN_REGISTER.ERROR_MESSAGE'));
            }
        });
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'status-active';
            case 'PENDING':
                return 'status-pending';
            case 'DEACTIVE':
                return 'status-deactive';
        }
        return '';
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

}
