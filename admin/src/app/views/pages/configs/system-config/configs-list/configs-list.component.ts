// Material
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatSnackBar, Sort} from '@angular/material';
// Translate Module
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {ConfigEditComponent} from '../config-edit/config-edit.component';
import {ConfigAddComponent} from '../config-add/config-add.component';
import {ConfigDetailComponent} from '../config-detail/config-detail.component';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ConfigService} from '../../../../../service/config.service';

@Component({
    selector: 'kt-configs-list',
    templateUrl: './configs-list.component.html',
    styleUrls: ['./configs-list.component.scss']
})
export class ConfigsListComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    displayedColumns: string[] = ['index', 'key', 'value', 'note', 'createdTime', 'creatorName', 'actions'];
    dataSource: any = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    keyList = [];
    search_value: any = '';
    keys: Array<any> = [];
    maxSizeDisplay: number = 20;

    // sort
    sortActive = '';
    sortDirection = '';

    allLabel = 'Tất cả';
    canAccess: boolean = true;

    loading: boolean = false;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private configService: ConfigService,
        private fb: FormBuilder,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.fetchData();
    }

    fetchData() {
        this.getConfig(this.page + 1, this.limit);
        this.getAllKey();
    }

    getConfig(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.SYSTEM_CONFIG_GET_ALL)) {
            this.canAccess = false;
            return;
        }
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const req = {
            page: page,
            limit: limit,
            key: this.keys.length == this.keyList.length ? '' : this.keys.join(','),
            search: this.search_value,
            sort: sortValue,
        };
        this.loading = true;
        try {
            this.configService.getAllSysConfig(req).subscribe(res => {
                if (res && res.status) {
                    const data: Array<any> = res.data.list;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    data.forEach(it => {
                        it['actions'] = '';
                    });
                    this.dataSource = data;
                    this.loading = false;
                    this.cdr.markForCheck();
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            this.loading = false;
        }
    }

    getAllKey() {
        this.configService.getAllSysConfigKey().subscribe(res => {
            if (res && res.status) {
                this.keyList = res.data;
                this.keys = this.keyList;
                this.cdr.markForCheck();
            }
        });
    }

    pageChange(event) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getConfig(this.page + 1, this.limit);
    }

    add() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.SYSTEM_CONFIG_ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ConfigAddComponent, {data: {}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.page = Math.ceil((this.totalElement + 1) / this.limit) - 1;
            this.fetchData();
        });
    }

    edit(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.SYSTEM_CONFIG_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ConfigEditComponent, {data: {element}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    deleteConfig(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.SYSTEM_CONFIG_DELETE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('SYSTEM_CONFIG.DELETE.TITLE');
        const _description: string = `${this.translate.instant('SYSTEM_CONFIG.DELETE.DESCRIPTION')} ${element.key} ?`;
        const _waitDescription: string = this.translate.instant('SYSTEM_CONFIG.DELETE.WAIT_DESCRIPTION');
        const _deleteMessage = this.translate.instant('SYSTEM_CONFIG.DELETE.MESSAGE');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.configService.deleteSysConfig(element.id).subscribe(res => {
                if (res.status) {
                    this.notifyService.notify('SUCCESS', '', _deleteMessage);
                    this.fetchData();
                } else {
                    this.notifyService.notify('ERROR', '', res.message);
                }
            });
        });
    }

    search() {
        this.page = 0;
        this.getConfig(1, this.limit);
    }

    view(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.SYSTEM_CONFIG_GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ConfigDetailComponent, {data: {element}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }
}
