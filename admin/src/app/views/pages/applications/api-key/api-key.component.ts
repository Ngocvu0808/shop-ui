import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { NotifyService } from '../../../../service/notify.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../../service/application.service';
import { PageEvent } from '@angular/material/paginator';
import { PermissionService } from '../../../../core/_common/permission.service';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

@Component({
    selector: 'mar-api-key',
    templateUrl: './api-key.component.html',
    styleUrls: ['./api-key.component.scss']
})
export class ApiKeyComponent implements OnInit {

    displayedColumns: string[] = ['index', 'apiKey', 'createDate', 'createBy', 'status', 'actions'];
    dataSource = [];
    searchValue: string = '';
    allLabel: any;

    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];

    filterStatus: Array<any> = [];
    statusValue: any;
    // sort
    sortActive = '';
    sortDirection = '';
    appId: any = 0;
    isReloadDetail: boolean = true;

    @Input() isActiveTab: number;
    @Input() isReloadApiKey: any = false;

    @Output() reloadDetail = new EventEmitter();

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        private appService: ApplicationService,
        public cdr: ChangeDetectorRef,
        private permissionService: PermissionService,
        private notifyService: NotifyService,
        private route: ActivatedRoute
    ) { }

    ngOnChanges() {
        this.appId = this.route.snapshot.paramMap.get('id');
        if (this.isActiveTab == 1 || this.isReloadApiKey) {
            this.getStatusFilter();
            this.fetchData();
        }
    }

    ngOnInit() {
    }

    fetchData() {
        this.getAll(this.page + 1, this.limit);
    }

    getStatusFilter() {
        this.appService.getStatusList().subscribe(res => {
            if (res && res.status) {
                this.filterStatus = res.data;
                this.cdr.markForCheck();
            }
        });
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'status-active';
            case 'EXPIRED':
                return 'status-expired';
            case 'REJECTED':
                return 'status-deactive';
        }
        return '';
    }

    getAll(page: number, limit: number) {
        // if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_GET_ALL)) {
        //     return;
        // }
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const req = {
            page: page,
            limit: limit,
            status: this.statusValue,
            search: this.searchValue,
            sort: sortValue
        };
        this.appService.getListApiKeyOfApp(this.appId, req).subscribe(res => {
            if (res) {
                if (res.status) {
                    this.dataSource = res.data.list;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    createNew(element) {

    }

    cancel(element) {
        const req = {
            id: this.appId,
            apiKey: element.apiKey
        }
        const _title: string = this.translate.instant('APP.API_KEY.DELETE.TITLE');
        const _description: string = this.translate.instant('APP.API_KEY.DELETE.CONTENT');
        const _waitDescription: string = this.translate.instant('COMMON.UPDATING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.cancelApiKey(req).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                            this.reloadDetail.emit(this.isReloadDetail)
                            this.fetchData();
                            this.cdr.markForCheck()
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            }
        });
    }

    delete(element) {
        const obj = {
            id: this.appId,
            idKey: element.id
        }
        const _title: string = this.translate.instant('APP.API_KEY.DELETE.TITLE');
        const _description: string = this.translate.instant('APP.API_KEY.DELETE.CONTENT');
        const _waitDescription: string = this.translate.instant('COMMON.DELETING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.deleteApiKey(obj).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.DELETE_SUCCESS'));
                            this.getAll(this.page + 1, this.limit);
                            this.permissionService.reloadPermission();
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            }
        });
    }

    copyApiKey(val) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.layoutUtilsService.showActionNotification('Copied to clipboard', MessageType.Delete, 3000, true, false);
    }

    onPageChange(event: PageEvent) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getAll(this.page + 1, this.limit);
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

}
