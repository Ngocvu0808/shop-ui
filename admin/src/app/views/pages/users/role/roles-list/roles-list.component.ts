// Material
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar, Sort} from '@angular/material';
// Translate Module
import {TranslateService} from '@ngx-translate/core';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {FormBuilder} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {RoleAddComponent} from '../role-add/role-add.component';
import {RoleEditComponent} from '../role-edit/role-edit.component';
import {RoleDetailComponent} from '../role-detail/role-detail.component';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {Role} from '../../../../../models/role/Role';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-roles-list',
    templateUrl: './roles-list.component.html',
    styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'code', 'createdTime', 'actions'];
    dataSource: Array<Role> = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    searchValue: any = '';
    keys: any = [];
    permissions: any = [];
    roles: any = [];
    defaultRoleText: any = '';

    // sort
    sortActive = '';
    sortDirection = '';
    canAccess: boolean = true;

    loading: boolean = false;

    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
                private translate: TranslateService,
                private layoutUtilsService: LayoutUtilsService,
                private roleService: RoleService,
                private fb: FormBuilder,
                private notifyService: NotifyService,
                private cdr: ChangeDetectorRef,
                private permissionService: PermissionService) {
    }

    ngOnInit() {
        this.defaultRoleText = this.translate.instant('ROLE.GENERAL.DEFAULT_ROLE_TEXT');
        this.getPermission();
        this.fetchData();
    }

    fetchData() {
        this.getAll(this.page + 1, this.limit);
    }

    getAll(page, limit) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_ALL)) {
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
            search: this.searchValue,
            sort: sortValue
        };
        this.loading = true;
        this.roleService.getAll(req).subscribe(res => {
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
    }

    pageChange(event) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.fetchData();
    }

    getPermission() {
        this.roleService.getAllPermission().subscribe(res => {
            if (res && res.status) {
                this.permissions = res.data;
            }
        });
    }

    addRole() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(RoleAddComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.page = Math.ceil((this.totalElement + 1) / this.limit) - 1;
            this.fetchData();
        });
    }

    editRole(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(RoleEditComponent, {data: {element}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    viewRole(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(RoleDetailComponent, {data: {element}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

    deleteRole(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.DELETE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('ROLE.DELETE.TITLE');
        const _description: string = this.translate.instant('ROLE.DELETE.CONTENT') + element.name;
        const _waitDescription: string = this.translate.instant('ROLE.DELETE.PROCESSING');
        const _deleteMessage = this.translate.instant('ROLE.DELETE.RESULT');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.roleService.delete(element.id).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', _deleteMessage);
                        this.fetchData();
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('ERROR', '', this.translate.instant('ROLE.DELETE.ERROR'));
                    }
                }
            });
        });
    }

    search() {
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

