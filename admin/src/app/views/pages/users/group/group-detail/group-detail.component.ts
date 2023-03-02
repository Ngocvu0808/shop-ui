import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {AddUserToGroupComponent} from '../add-user-to-group/add-user-to-group.component';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifyService} from '../../../../../service/notify.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {viewRoleDetail} from '../../../../../shared/view-role-detail/view-role-detail.component';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {RoleService} from '../../../../../service/role.service';
import {GroupService} from '../../../../../service/group.service';

@Component({
    selector: 'kt-group-user-detail',
    templateUrl: './group-detail.component.html',
    styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
    displayedColumns: string[] = ['id', 'username', 'display_name', 'email', 'user_role', 'user_group', 'status', 'actions'];
    groupId = '';
    groupData: any = {};
    groupRoles: any = [];
    groupUsers: any = [];
    groupUserResult: any = [];
    listUsers: Array<any> = [];
    users: Array<any> = [];
    filteredUsers: Array<any>;
    inputSearch: any = '';

    previousUrl = '';

    // mat-chip add user
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    userCtrl = new FormControl();
    searchUser: any = '';
    canAccess = true;

    @ViewChild('userInput', {static: true}) userInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', {static: true}) matAutocomplete: MatAutocomplete;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private groupService: GroupService,
        private roleService: RoleService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private notifyService: NotifyService,
        private permissionService: PermissionService
    ) {
        this.groupId = this.route.snapshot.paramMap.get('id');
        this.previousUrl = this.route.snapshot.queryParamMap.get('url');
    }

    async ngOnInit() {
        await this.getGroupDetail();
        await this.getAllUsers();
    }


    getGroupDetail() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.groupService.getById(this.groupId).subscribe(res => {
            if (res && res.status) {
                this.groupData = res.data;
                this.groupRoles = this.groupData.roles;
                this.groupUsers = this.groupData.users;
                this.groupUserResult = this.groupUsers;
                this.cdr.markForCheck();
            }
        });
    }

    getAllUsers() {
        this.groupService.getAllUserAndGroup('user').subscribe(res => {
            if (res && res.status) {
                this.listUsers = res.data;
                const ids: Array<any> = this.groupUsers.map(gr => gr.id);
                this.listUsers = this.listUsers.filter(it => !ids.includes(it.id));
                this.filteredUsers = this.listUsers;
                this.cdr.markForCheck();
            }
        });
    }

    search() {
        const search = this.inputSearch;
        const text = search.split(' ');
        const result = this.groupUsers.filter(
            function(item) {
                return text.every(function(el) {
                    return item.name.indexOf(el) > -1;
                });
            });
        this.groupUserResult = result.length > 0 ? result : [];

    }

    addUserToGroup() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.ADD_USER)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (this.users.length == 0) {
            return;
        }
        const idList: Array<any> = this.users.map(it => it.id);
        const req = {
            listUserId: idList
        };
        try {
            this.groupService.addUsers(this.groupId, req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('GROUP.DETAIL.SUCCESS_MESSAGE'));
                        // update list user of group, clear search value
                        this.users = [];
                        this.searchUser = '';
                        this.filteredUsers = this.filteredUsers.filter(it => !idList.includes(it.id));
                        this.cdr.markForCheck();
                        this.getGroupDetail();
                    } else {
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('GROUP.DETAIL.ERROR_MESSAGE'));
        }
    }

    deleteUser(user) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.DELETE_USER)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('GROUP.DETAIL.DELETE_USER_TITLE');
        const _description: string = this.translate.instant('GROUP.DETAIL.DELETE_USER_DESC', {
            username: user.name,
            group_name: this.groupData.name
        });
        const _waitDescription: string = this.translate.instant('GROUP.DETAIL.PROCESSING');
        const _deleteMessage = this.translate.instant('GROUP.DETAIL.RESULT');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            const params = {
                id: this.groupId,
                idUserDelete: user.id
            };
            try {
                this.groupService.removeUser(params).subscribe(res => {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', _deleteMessage);
                        this.filteredUsers = this.filteredUsers.filter(it => it.id != user.id);
                        this.cdr.markForCheck();
                        this.getGroupDetail();
                        this.getAllUsers();
                    } else {
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                });
            } catch (e) {
                this.notifyService.notify('ERROR', '', this.translate.instant('GROUP.DETAIL.ERROR_MESSAGE'));
            }
        });
    }

    viewUserDetail(id: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.router.navigate(['/user', id], {queryParams: {url: this.router.url}});
    }

    viewRoleDetail(roleId: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        viewRoleDetail(roleId, this.dialog, this.roleService, this.notifyService, this.translate);
    }


    showUserList(groupId: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.GET_ALL_USER)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const groupUserIds = this.groupUsers.map(it => it.id);
        const dialogRef = this.dialog.open(AddUserToGroupComponent, {
            data: {group_id: groupId, user_ids: groupUserIds},
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.getGroupDetail();
            this.listUsers = this.listUsers.filter(it => !res.ids.includes(it.id));
            this.filteredUsers = this.listUsers;
            this.cdr.markForCheck();
        });
    }

    change() {
        const name = this.searchUser;
        this.filteredUsers = name ? this._filter(name) : this.listUsers;
        this.cdr.markForCheck();
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our user
        if ((value || '').trim()) {
            if (this.users.some(it => it.name.toLowerCase() == value)) {
                return;
            }
            const user: any = this.listUsers.filter(u => u.name.toLowerCase() == value);
            if (!user || user.length == 0) {
                return;
            }
            this.users = this.users.concat(user);
            this.users = Array.from(new Set(this.users));
            this.cdr.markForCheck();
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.userCtrl.setValue(null);
    }

    remove(user: any): void {
        const index = this.users.indexOf(user);

        if (index >= 0) {
            this.users.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if (this.users.includes(event.option.value)) {
            return;
        }
        this.users.push(event.option.value);
        this.userInput.nativeElement.value = '';
        this.userCtrl.setValue(null);
    }

    private _filter(name: any): any[] {
        const filterValue = name.toString().toLowerCase();
        return this.listUsers.filter(user => user.name.toLowerCase().indexOf(filterValue) != -1);
    }

    back() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.GET_ALL)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            this.router.navigateByUrl('/');
            return;
        }
        this.router.navigateByUrl(this.previousUrl ? this.previousUrl : '/group/list');
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }
}
