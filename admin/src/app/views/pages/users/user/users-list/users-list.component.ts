import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatCheckboxChange, MatDialog, Sort} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {UserEditComponent} from '../user-edit/user-edit.component';
import {UserAddComponent} from '../user-add/user-add.component';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {each, find} from 'lodash';
import {viewRoleDetail} from '../../../../../shared/view-role-detail/view-role-detail.component';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {NotifyService} from '../../../../../service/notify.service';
import {UserService} from '../../../../../service/user.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
    displayedColumns: string[] = ['select', 'username', 'name', 'email', 'roleUsers', 'userGroups', 'status', 'actions'];
    users = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    currentUserId: any;
    dataSource = [];

    // Filter
    roleValues: Array<any> = [];
    statusValues: Array<any> = [];
    groupValues: Array<any> = [];
    searchValue: '';
    listStatusFilter: Array<any> = [];
    listStatusValue: Array<any> = [];
    listRoleFilter: Array<any> = [];
    listRoleValue: Array<any> = [];
    listGroupFilter: Array<any> = [];
    listGroupValue: Array<any> = [];
    isCurrentUser: boolean = false;

    // Checkbox Table
    selection = new SelectionModel<any>(true, []);
    selected: Array<any> = [];
    isCheckAll: boolean = false;
    checkAllFlag: boolean = false;
    poolSelect: Array<any> = [];
    unSelect: Array<any> = [];

    // sort
    sortActive = '';
    sortDirection = '';

    allLabel = 'Tất cả';
    canAccess: boolean = true;
    loading: boolean = false;

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private userService: UserService,
        private roleService: RoleService,
        private router: Router,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.checkIsCurrentUser();
        this.getStatusFilter();
        this.getGroupsFilter();
        this.getRolesFilter();
        this.fetchUsers();
    }

    checkIsCurrentUser() {
        this.currentUserId = this.permissionService.getCurrentUserId();
    }

    getStatusFilter() {
        this.userService.getListStatusUser().subscribe(res => {
            if (res && res.status) {
                this.listStatusFilter = res.data;
                this.listStatusValue = this.listStatusFilter.map(item => item.name);
                this.statusValues = this.listStatusValue;
                this.cdr.markForCheck();
            }
        });
    }

    getGroupsFilter() {
        this.userService.getListGroupHasUser().subscribe(res => {
            if (res && res.status) {
                this.listGroupFilter = res.data;
                this.listGroupValue = this.listGroupFilter.map(gr => gr.id);
                this.groupValues = this.listGroupValue;
                this.cdr.markForCheck();
            }
        });
    }

    getRolesFilter() {
        this.userService.getListRoleAssigned().subscribe(res => {
            if (res && res.status) {
                this.listRoleFilter = res.data;
                this.listRoleValue = this.listRoleFilter.map(r => r.id);
                this.roleValues = this.listRoleValue;
                this.cdr.markForCheck();
            }
        });
    }

    fetchUsers() {
        this.selection.clear();
        this.getUsers(this.page + 1, this.limit);
    }

    search() {
        this.page = 0;
        this.fetchUsers();
    }

    getUsers(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.GET_ALL)) {
            // this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const params = {
            page: page,
            limit: limit,
            search: this.searchValue,
            status: this.statusValues.length === this.listStatusFilter.length ? '' : this.statusValues.join(','),
            roles: this.roleValues.length === this.listRoleFilter.length ? '' : this.roleValues.join(','),
            groups: this.groupValues.length === this.listGroupFilter.length ? '' : this.groupValues.join(','),
            sort: sortValue,
        };
        this.loading = true;
        try {
            this.userService.getAll(params).subscribe(res => {
                if (res) {
                    this.loading = false;
                    const data: Array<any> = res.data.list;
                    data.forEach((it: { [x: string]: string }) => {
                        it['actions'] = '';
                    });
                    this.users = data;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    if (this.isCheckAll) {
                        this.users.forEach(it => {
                            if (!this.poolSelect.includes(it.id)) {
                                this.selected.push(it.id);
                            }
                        });
                        this.cdr.markForCheck();
                    }
                    let ids: Array<any> = data.map(it => it.id);
                    this.poolSelect = this.poolSelect.concat(ids);
                    this.poolSelect = Array.from(new Set(this.poolSelect));
                    if (this.isCheckAll) {
                        this.selected = this.poolSelect;
                    }
                    this.unSelect = this.poolSelect.filter(it => !this.selected.includes(it));
                    this.detectUserIsSelect();
                    this.cdr.markForCheck();
                }
            });
        } catch (e) {
            console.log(e);
            this.loading = false;
        }

    }

    viewUserDetail(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.router.navigate(['/user', element.id]);
    }

    editUser(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(UserEditComponent, {
            data: {element},
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchUsers();
            this.getRolesFilter();
        });
    }

    addUser() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(UserAddComponent, {
            data: {},
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.page = Math.ceil((this.totalElement + 1) / this.limit) - 1;
            this.fetchUsers();
            this.getRolesFilter();
        });
    }

    unLockUser(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.ENABLE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.changeStatus('USER_ENABLE', element);
    }

    lockUser(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.DISABLE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.changeStatus('USER_DISABLE', element);
    }

    resetPassword(element: any) {
        if (this.checkPermission(PERMISSION_CODE.USER.RESET_PASS)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('USER.USER_MANAGE.RESET_PASS_TITLE');
        const _description: string = this.translate.instant('USER.USER_MANAGE.RESET_PASS_CONFIRM');
        const _waitDescription: string = this.translate.instant('USER.USER_MANAGE.RESET_PASS_WAIT');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.userService.resetPass(element.id).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('USER.USER_MANAGE.RESET_PASS_SUCCESS'));
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
            }
        });
    }

    changeStatus(action: string, element: any) {
        const _title: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_USER_TITLE')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_USER_TITLE');
        const _description: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_USER_DESC', {
                    name: element.name,
                })
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_USER_DESC', {
                    name: element.name,
                });
        const _waitDescription: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_USER_WAIT_DESC')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_USER_WAIT_DESC');
        const _successMsg: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_SUCCESS_MSG')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_SUCCESS_MSG');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.userService.changeStatus(element.id, action).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', _successMsg);
                            this.fetchUsers();
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
            }
        });
    }

    changeStatusUsers(status) {
        if (this.isCheckAll) {
            this.changeStatusAll(status);
        } else {
            this.changeStatusListUser(status);
        }
    }

    changeStatusListUser(status: string) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.UPDATE_STATUS_LIST)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_LIST_USER_TITLE')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_LIST_USER_TITLE');
        const _description: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_LIST_USER_DESC')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_LIST_USER_DESC');
        const _waitDescription: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_LIST_USER_WAIT_DESC')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_LIST_USER_WAIT_DESC');
        const _successMsg: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_LIST_USER_SUCCESS_MSG')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_LIST_USER_SUCCESS_MSG');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (this.isCheckAll) {
                this.changeStatusAll(status);
            } else {
                const payload = {
                    status: status,
                    ids: this.selected,
                    is_blacklist: false,
                };
                if (this.checkAllFlag) {
                    if (this.unSelect.length > this.selected.length) {
                        payload.ids = this.selected;
                        payload.is_blacklist = false;
                    } else {
                        payload.ids = this.unSelect;
                        payload.is_blacklist = true;
                    }
                }
                try {
                    this.userService.changeStatusListUser(payload).subscribe(res => {
                        if (res) {
                            if (res.status) {
                                this.notifyService.notify('SUCCESS', '', _successMsg);
                                this.selected = [];
                                this.fetchUsers();
                                return;
                            }
                            if (res.httpCode != 403) {
                                this.notifyService.notify('WARN', '', res.message);
                            }
                        }
                    });
                } catch (e) {
                    console.log(e);
                    this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
                }
            }
        });
    }

    changeStatusAll(status: string) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.UPDATE_STATUS_ALL)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_ALL_USER_TITLE')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_ALL_USER_TITLE');
        const _description: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_ALL_USER_DESC')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_ALL_USER_DESC');
        const _waitDescription: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_ALL_USER_WAIT_DESC')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_ALL_USER_WAIT_DESC');
        const _successMsg: string =
            status === 'DEACTIVE'
                ? this.translate.instant('USER.USER_MANAGE.LOCK_ALL_USER_SUCCESS_MSG')
                : this.translate.instant('USER.USER_MANAGE.UN_LOCK_ALL_USER_SUCCESS_MSG');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            const payload = {
                status: status,
            };
            try {
                this.userService.changeStatusAllUser(payload).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', _successMsg);
                            this.selected = [];
                            this.fetchUsers();
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
            }
        });
    }

    deleteUser(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.DELETE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('USER.USER_MANAGE.DELETE_USER_TITLE');
        const _description: string = this.translate.instant('USER.USER_MANAGE.DELETE_USER_DESC', {name: element.name});
        const _waitDescription: string = this.translate.instant('USER.USER_MANAGE.DELETE_USER_WAIT_DESC');
        const _successMsg: string = this.translate.instant('USER.USER_MANAGE.DELETE_SUCCESS_MSG');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.userService.delete(element.id).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', _successMsg);
                            this.selected = [];
                            this.page = 0;
                            this.fetchUsers();
                            this.getRolesFilter();
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
            }
        });
    }

    deleteUsers() {
        if (this.isCheckAll) {
            this.deleteAllUser();
        } else {
            this.deleteListUser();
        }
    }

    deleteListUser() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.DELETE_LIST)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('USER.USER_MANAGE.DELETE_LIST_USER_TITLE');
        const _description: string = this.translate.instant('USER.USER_MANAGE.DELETE_LIST_USER_DESC');
        const _waitDescription: string = this.translate.instant('USER.USER_MANAGE.DELETE_LIST_USER_WAIT_DESC');
        const _successMsg: string = this.translate.instant('USER.USER_MANAGE.DELETE_LIST_SUCCESS_MSG');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            const payload = {
                ids: this.selected,
                is_blacklist: false,
            };
            if (this.checkAllFlag) {
                if (this.unSelect.length > this.selected.length) {
                    payload.ids = this.selected;
                    payload.is_blacklist = false;
                } else {
                    payload.ids = this.unSelect;
                    payload.is_blacklist = true;
                }
            }
            try {
                this.userService.deleteListUser(payload).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', _successMsg);
                            this.selected = [];
                            this.page = 0;
                            this.fetchUsers();
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
            }
        });
    }

    deleteAllUser() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.DELETE_ALL)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('USER.USER_MANAGE.DELETE_ALL_USER_TITLE');
        const _description: string = this.translate.instant('USER.USER_MANAGE.DELETE_ALL_USER_DESC');
        const _waitDescription: string = this.translate.instant('USER.USER_MANAGE.DELETE_ALL_USER_WAIT_DESC');
        const _successMsg: string = this.translate.instant('USER.USER_MANAGE.DELETE_ALL_SUCCESS_MSG');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.userService.deleteAllUser().subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', _successMsg);
                            this.selected = [];
                            this.fetchUsers();
                            return;
                        }
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
            }
        });
    }

    displayRoleFilter() {
        const roles: Array<any> = [];
        each(this.roleValues, id => {
            const role = find(this.listRoleFilter, elem => elem.id === id);
            if (role) {
                roles.push(role.name);
            }
        });
        return roles;
    }

    displayGroupFilter() {
        const groups: Array<any> = [];
        each(this.groupValues, id => {
            const group = find(this.listGroupFilter, elem => elem.id === id);
            if (group) {
                groups.push(group.name);
            }
        });
        return groups;
    }

    pageChange(event: any) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getUsers(this.page + 1, this.limit);
    }

    detectUserIsSelect() {
        this.selected = Array.from(new Set(this.selected));
        const selected = this.isCheckAll ? this.users : this.users.filter(cp => this.selected.includes(cp.id));
        for (let u of selected) {
            this.selection.toggle(u);
        }
    }

    onMasterChange($event: MatCheckboxChange) {
        this.isCheckAll = $event.checked;
        if ($event.checked) {
            this.users.forEach(row => this.selection.select(row));
            this.unSelect = [];
            this.selected = this.poolSelect;
            this.checkAllFlag = true;
        } else {
            this.selection.clear();
            this.selected = [];
            this.unSelect = this.poolSelect;
            this.checkAllFlag = false;
        }
    }

    onCheckboxChange($event: MatCheckboxChange, row: any) {
        if ($event) {
            this.selection.toggle(row);
            const set = new Set(this.selected);
            if ($event.checked) {
                // add to list checked
                set.add(row.id);
            } else {
                //remove from list checked
                set.delete(row.id);
                if (this.isCheckAll) {
                    this.isCheckAll = false;
                }
            }
            this.selected = Array.from(set);
            this.unSelect = this.poolSelect.filter(it => !this.selected.includes(it));
            if (this.unSelect.length == 0) {
                this.isCheckAll = true;
            }
            this.cdr.markForCheck();
        }
    }

    isChecked(row: any) {
        return this.isCheckAll == true || this.selection.isSelected(row);
    }

    getItemStatusString(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'Pending';
            case 'ACTIVE':
                return 'Active';
            case 'DEACTIVE':
                return 'Deactive';
        }
        return '';
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'status-pending';
            case 'ACTIVE':
                return 'status-active';
            case 'DEACTIVE':
                return 'status-deactive';
        }
        return '';
    }

    viewRoleDetail(roleId: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        viewRoleDetail(roleId, this.dialog, this.roleService, this.notifyService, this.translate);
    }

    viewGroupDetail(groupId: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.router.navigate(['/group', groupId], {
            queryParams: {url: '/user/list'},
        });
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchUsers();
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

    onMasterRoleSelectChange(event: any) {
        this.roleValues = event;
        this.search();
    }

    onMasterStatusSelectChange(event: any) {
        this.statusValues = event;
        this.search();
    }

    onMasterGroupSelectChange(event: any) {
        this.groupValues = event;
        this.search();
    }
}
