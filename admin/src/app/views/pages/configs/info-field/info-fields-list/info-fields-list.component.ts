import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar, Sort} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {InfoFieldAddComponent} from '../info-field-add/info-field-add.component';
import {InfoFieldEditComponent} from '../info-field-edit/info-field-edit.component';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ConfigService} from '../../../../../service/config.service';

@Component({
    selector: 'kt-info-fields-list',
    templateUrl: './info-fields-list.component.html',
    styleUrls: ['./info-fields-list.component.scss']
})
export class InfoFieldsListComponent implements OnInit {
    displayedColumns: string[] = ['index', 'name', 'key', 'type', 'typeValue', 'formatValue', 'note', 'object', 'createdTime', 'creatorName', 'actions'];
    dataSource: Array<any> = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    noSearchResult = false;
    search_value: any = '';
    types: any = [];
    listTypeValue: any = '';
    listType: any = '';
    listTypeName: any = [];
    listTypeValues: any = [];
    // sort
    sortActive = '';
    sortDirection = '';
    canAccess: boolean = true;

    loading: boolean = false;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private configService: ConfigService,
        private notifyService: NotifyService,
        public cdr: ChangeDetectorRef,
        private permissionService: PermissionService
    ) {

    }

    ngOnInit() {
        this.fetchData();
        this.getType();
        this.getTypeValue();
    }

    fetchData() {
        this.getAll(this.page + 1, this.limit);
    }

    getAll(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.FIELD_CONFIG_GET_ALL)) {
            this.canAccess = false;
            return;
        }
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const params = {
            page: page,
            limit: limit,
            type: this.types.length == this.listType.length ? '' : this.types.join(','),
            search: this.search_value,
            sort: sortValue
        };
        this.loading = true;
        this.configService.getAllFieldConfig(params).subscribe(res => {
            if (res && res.status) {
                this.loading = false;
                const data: Array<any> = res.data.list;
                this.totalPage = res.data.totalPage;
                this.totalElement = res.data.num;
                data.forEach(it => {
                    it['actions'] = '';
                });
                this.dataSource = data;
                this.cdr.markForCheck();
                if (this.dataSource.length == 0) {
                    this.noSearchResult = true;
                }
            }
        });
    }

    getType() {
        const params = {
            service: 'field_config',
            type: 'type'
        };
        this.configService.getTypeFieldConfig(params).subscribe(res => {
            if (res && res.status) {
                this.listType = res.data;
                this.listTypeValues = this.listType.map(it => it.value);
                this.types = this.listTypeValues;
                this.cdr.markForCheck();
            }
        });
    }

    getTypeValue() {
        const params = {
            service: 'field_config',
            type: 'type_value'
        };
        this.configService.getTypeValueFieldConfig(params).subscribe(res => {
            if (res && res.status) {
                this.listTypeValue = res.data;
            }
        });
    }

    addField() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.FIELD_CONFIG_ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(InfoFieldAddComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.page = Math.ceil((this.totalElement + 1) / this.limit) - 1;
            this.fetchData();
        });
    }

    editField(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.FIELD_CONFIG_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(InfoFieldEditComponent, {data: {element}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }


    getTypeDisplay(type) {
        switch (type) {
            case 'SYS':
                return 'Thông tin khác';
            case 'PARAM':
                return 'Parameter';
            case 'DEFAULT':
                return 'Thông tin mặc định';
            default:
                break;
        }
    }


    pageChange(event) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.fetchData();
    }

    deleteField(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.FIELD_CONFIG_DELETE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('FIELD.DELETE.TITLE');
        const _description: string = this.translate.instant('FIELD.DELETE.CONTENT') + element.name;
        const _waitDescription: string = this.translate.instant('FIELD.DELETE.PROCESSING');
        const _deleteMessage = this.translate.instant('FIELD.DELETE.RESULT');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.configService.deleteFieldConfig(element.id).subscribe(res => {
                if (res.status) {
                    this.notifyService.notify('SUCCESS', '', _deleteMessage);
                    this.fetchData();
                } else {
                    this.notifyService.notify('ERROR', this.translate.instant('FIELD.DELETE.ERROR'), res.message);
                }
            });
        });
    }

    search() {
        this.listTypeName = [];
        this.listType.map((type) => {
            if (this.types.length > 0 && this.types.indexOf(type.value) != -1) {
                this.listTypeName.push(type.name);
            }
        });
        this.page = 0;
        this.fetchData();
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

