import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { NotifyService } from '../../../../../service/notify.service';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../../../core/_common/permission.service';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { each, find } from 'lodash';
import { viewRoleDetail } from '../../../../../shared/view-role-detail/view-role-detail.component';
import { PERMISSION_CODE } from '../../../../../core/_common/config/permissionCode';
import { ApplicationService } from '../../../../../service/application.service';
import { RoleService } from '../../../../../service/role.service';

@Component({
    selector: 'mar-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnChanges {
    displayedColumns: string[] = ['index', 'username', 'email', 'name', 'role', 'actions'];
    appId: any = 0;
    appName: any;
    dataSource = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    filterText: any = '';
    status: any = '';
    searchValue: string = '';

    rolesFilter: Array<any> = [];
    appDetail: Array<any> = [];
    listRoleFilter: Array<any> = [];
    listRoleValue: Array<any> = [];
    allLabel = '';
    listUserId: any = [];
    // sort
    sortActive = '';
    sortDirection = '';

    @Input() isActiveTab: number;
    loading: any;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private appService: ApplicationService,
        private roleService: RoleService,
        private layoutUtilsService: LayoutUtilsService,
        private fb: FormBuilder,
        public cdr: ChangeDetectorRef,
        private router: Router,
        private notifyService: NotifyService,
        private permissionService: PermissionService,
        private route: ActivatedRoute,
    ) {
        this.appId = this.route.snapshot.paramMap.get('id');
        this.allLabel = this.translate.instant('COMMON.ALL_LABEL');
    }

    ngOnChanges() {
        if (this.isActiveTab == 2) {
            this.getRolesFilter();
            this.getAppDetail();
            this.fetchData();
        }
    }

    ngOnInit() {
    }

    getRolesFilter() {
        this.appService.getRoleFilter(this.appId).subscribe(res => {
            if (res && res.status) {
                this.listRoleFilter = res.data;
                this.listRoleValue = this.listRoleFilter.map(r => r.id);
                this.rolesFilter = this.listRoleValue;
                this.cdr.markForCheck();
            }
        });
    }

    displayRoleFilter() {
        const roles: Array<any> = [];
        each(this.rolesFilter, id => {
            const role = find(this.listRoleFilter, elem => elem.id === id);
            if (role) {
                roles.push(role.name);
            }
        });
        return roles;
    }

    getAppDetail() {
        this.appService.getById(this.appId).subscribe((res) => {
            if (res) {
                if (res.status) {
                    this.appDetail = res.data;
                    this.appName = res.data.name
                    this.cdr.markForCheck();
                }
            }
        });
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
    }

    fetchData() {
        this.getAll();
    }

    getAll() {
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const params = {
            roles: (this.rolesFilter.length === this.listRoleFilter.length) ? '' : this.rolesFilter.join(','),
            search: this.searchValue,
            sort: sortValue
        };
        this.loading = true;
        this.appService.getListUser(this.appId, params).subscribe(res => {
            if (res) {
                if (res.status) {
                    const data = res.data;
                    data.forEach((it) => {
                        it['actions'] = '';
                    });
                    this.dataSource = data;
                    this.listUserId = this.dataSource.map(user => user.id);
                    this.loading = false;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    add() {
        const dialogRef = this.dialog.open(UserAddComponent, {
            data: { appId: this.appId, listUserId: this.listUserId },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
            this.getRolesFilter();
        });
    }

    edit(item) {
        item['appId'] = this.appId;
        const dialogRef = this.dialog.open(UserEditComponent, { data: { item }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.getAll();
        });
    }

    delete(element: any) {
        const _title: string = this.translate.instant('APP.DELETE.USER_DELETE.TITLE');
        const _description: string = this.translate.instant('APP.DELETE.USER_DELETE.CONTENT') + element.name + ' khỏi ứng dụng ' + this.appName;
        const _waitDescription: string = this.translate.instant('COMMON.DELETING');
        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        const params = {
            id: this.appId,
            userId: element.id
        };
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.appService.removeUser(params).subscribe(res => {
                    if (res) {
                        if (res.status) {
                            this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.DELETE_SUCCESS'));
                            this.getAll();
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

    onPageChange(event: PageEvent) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getAll();
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    onMasterSelect(event: any) {
        this.rolesFilter = event;
        this.fetchData();
    }

    viewRoleDetail(roleId: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        viewRoleDetail(roleId, this.dialog, this.roleService, this.notifyService, this.translate);
    }
}
