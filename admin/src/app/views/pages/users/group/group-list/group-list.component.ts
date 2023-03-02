import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog, Sort} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {NotifyService} from '../../../../../service/notify.service';
import {GroupAddComponent} from '../group-add/group-add.component';
import {GroupEditComponent} from '../group-edit/group-edit.component';
import {Router} from '@angular/router';
import {each, find} from 'lodash';
import {viewRoleDetail} from '../../../../../shared/view-role-detail/view-role-detail.component';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {GroupService} from '../../../../../service/group.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-group-users-list',
    templateUrl: './group-list.component.html',
    styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'code', 'roles', 'numberUser', 'createdTime', 'actions'];
    isLoading = true;
    dataSource: Array<any> = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    searchValue: any = '';
    keys: any = [];
    permissions: any = [];
    roles: any = [];
    listRoleFilter: any = [];
    listRoleValue: any = [];
    roleValue: any = [];

    // sort
    sortActive = '';
    sortDirection = '';

    allLabel = 'Tất cả';
    canAccess: boolean = true;

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private groupService: GroupService,
        private roleService: RoleService,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private permissionService: PermissionService) {

    }

    ngOnInit() {
        this.fetchData();
        this.getRolesFilter();
    }

    fetchData() {
        this.getAll(this.page + 1, this.limit);
    }

    getAll(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.GET_ALL)) {
            this.canAccess = false;
            return;
        }
        this.isLoading = true;
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const params = {
            page: page,
            limit: limit,
            role: this.roleValue.length == this.listRoleFilter.length ? '' : this.roleValue,
            search: this.searchValue,
            sort: sortValue
        };
        this.groupService.getAll(params).subscribe(res => {
            if (res && res.status) {
                const data: Array<any> = res.data.list;
                this.totalPage = res.data.totalPage;
                this.totalElement = res.data.num;
                data.forEach(it => {
                    it['actions'] = '';
                });
                this.dataSource = data;
                this.cdr.markForCheck();
            }
        });
        this.isLoading = false;
    }

    getRolesFilter() {
        this.groupService.getAllRoleAssigned().subscribe(res => {
            if (res && res.status) {
                this.listRoleFilter = res.data;
                this.listRoleValue = this.listRoleFilter.map(r => r.id);
                this.roleValue = this.listRoleValue;
                this.cdr.markForCheck();
            }
        });
    }

    displayRoleFilter() {
        const roles: Array<any> = [];
        each(this.roleValue, id => {
            const role = find(this.listRoleFilter, elem => elem.id === id);
            if (role) {
                roles.push(role.name);
            }
        });
        return roles;
    }

    pageChange(event) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getAll(this.page + 1, this.limit);
    }

    addGroup() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(GroupAddComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.page = Math.ceil((this.totalElement + 1) / this.limit) - 1;
            this.getAll(this.page + 1, this.limit);
        });
    }

    editGroup(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(GroupEditComponent, {data: {element}, disableClose: true});
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.getAll(this.page + 1, this.limit);
        });
    }

    viewGroup(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.router.navigate(['/group', element.id]);
    }

    deleteGroup(element) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.DELETE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('GROUP.DELETE.TITLE');
        const _description: string = this.translate.instant('GROUP.DELETE.DESCRIPTION') + '\n' + element.name + '?';
        const _waitDescription: string = this.translate.instant('GROUP.DELETE.PROCESSING');
        const _deleteMessage = this.translate.instant('GROUP.DELETE.DELETE_SUCCESS');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.groupService.delete(element.id).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', _deleteMessage);
                            this.fetchData();
                        } else {
                            if (res.httpCode != 403) {
                                this.notifyService.notify('WARN', '', res.message);
                            }
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('GROUP.DELETE.ERROR'));
            }

        });
    }

    search() {
        this.page = 0;
        this.getAll(this.page + 1, this.limit);
    }

    viewRoleDetail(roleId: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        viewRoleDetail(roleId, this.dialog, this.roleService, this.notifyService, this.translate);
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

    onMasterRoleSelectChange(event: any) {
        this.roleValue = event;
        this.fetchData();
    }
}

