import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {TranslateService} from '@ngx-translate/core';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {UserService} from '../../../../../service/user.service';
import {RoleService} from '../../../../../service/role.service';
import {Router} from '@angular/router';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {UserEditComponent} from '../../../users/user/user-edit/user-edit.component';
import {each, find} from 'lodash';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
import {ProductService} from '../../../../../service/product.service';
import {ProductAddComponent} from '../product-add/product-add.component';
import { MatCheckboxChange } from '@angular/material';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {ProductEditComponent} from '../product-edit/product-edit.component';
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'mar-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

    displayedColumns: string[] = ['select', 'username', 'name', 'email', 'available', 'userGroups', 'status', 'actions'];
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
    isCurrentUser = false;

    // Checkbox Table
    selection = new SelectionModel<any>(true, []);
    selected: Array<any> = [];
    isCheckAll = false;
    checkAllFlag = false;
    poolSelect: Array<any> = [];
    unSelect: Array<any> = [];
    idAdds: Array<any> = [];
    // sort
    sortActive = '';
    sortDirection = '';
    mapIdPicked: string;
    allLabel = 'Tất cả';
    canAccess = true;
    loading = false;

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
        private userService: UserService,
        private productService: ProductService,
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
        this.initMap();
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
        this.getProducts(this.page + 1, this.limit);
    }

    search() {
        this.page = 0;
        this.fetchUsers();
    }

    getProducts(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.PRODUCT.GETALL)) {
            // this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const params = {
            page,
            limit,
            search: this.searchValue,
            status: this.statusValues.length === this.listStatusFilter.length ? '' : this.statusValues.join(','),
            sort: sortValue,
        };
        this.loading = true;
        try {
            this.productService.getAll(params).subscribe(res => {
                if (res) {
                    this.loading = false;
                    const data: Array<any> = res.data.list;
                    data.forEach((it: { [x: string]: string }) => {
                        it.actions = '';
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
                    const ids: Array<any> = data.map(it => it.id);
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

    viewProductDetail(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        console.log('---------------element', element.id);
        const dialogRef = this.dialog.open(ProductDetailComponent, { data: { element }, disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    fetchData() {
        this.getProducts(this.page + 1, this.limit);
    }
    editProduct(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ProductEditComponent, {
            data: {element},
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.fetchData();
        });
    }

    addProduct() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.PRODUCT.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const dialogRef = this.dialog.open(ProductAddComponent, {
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


    initMap() {
        const data = localStorage.getItem(environment.ID_PICKED);
        console.log('-----localStorage.getItem', localStorage.getItem(environment.ID_PICKED));
        if (!data) {
            this.mapIdPicked = 'A';
        } else {
            this.mapIdPicked = data;
        }
    }

    addToCart() {
        const dialogRef = this.layoutUtilsService.deleteElement('Xác nhận', 'Xác nhận thêm vào đơn hàng', 'Đang thêm');
        dialogRef.afterClosed().subscribe(res => {
            this.idAdds = this.selected;
            console.log('---------idAdds', this.idAdds);
            for (let i = 0; i < this.idAdds.length; i++) {
                console.log('---------idAdds', this.idAdds);
                const checkExists = ',' + this.idAdds[i];
                if ( !this.mapIdPicked.includes(checkExists)) {
                    this.mapIdPicked += checkExists;
                }
            }
            console.log('-----this.mapIdPicked.toString()', this.mapIdPicked);
            localStorage.setItem(environment.ID_PICKED, this.mapIdPicked);
            this.router.navigate(['/business/sell']);
        });
    }

    unLockUser(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.ENABLE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.changeStatus('USER_ENABLE', element);
    }

    lockProduct(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.DISABLE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.changeStatus('USER_DISABLE', element);
    }


    changeStatus(action: string, element: any) {
        const _title: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('PRODUCT.DEACTIVE_TITLE')
                : this.translate.instant('PRODUCT.ACTIVE_TITLE');
        const _description: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('PRODUCT.DEACTIVATE_WAIT_MESS')
                : this.translate.instant('PRODUCT.ACTIVATE_WAIT_MESS');
        const _waitDescription: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('COMMON.UPDATING')
                : this.translate.instant('COMMON.UPDATING');
        const _successMsg: string =
            action === 'USER_DISABLE'
                ? this.translate.instant('COMMON.SUCCESS')
                : this.translate.instant('COMMON.SUCCESS');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                this.productService.disable(element.id).subscribe(res => {
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
                    status,
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
                status,
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

    deleteProduct(element: any) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.DELETE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const _title: string = this.translate.instant('PRODUCT.ACTIVE_TITLE');
        const _description: string = this.translate.instant('PRODUCT.ACTIVATE_WAIT_MESS', {name: element.name});
        const _waitDescription: string = this.translate.instant('COMMON.UPDATING');
        const _successMsg: string = this.translate.instant('COMMON.MESSAGE_SUCCESS_EDIT');
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

    pageChange(event: any) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getProducts(this.page + 1, this.limit);
    }

    detectUserIsSelect() {
        this.selected = Array.from(new Set(this.selected));
        const selected = this.isCheckAll ? this.users : this.users.filter(cp => this.selected.includes(cp.id));
        for (const u of selected) {
            this.selection.toggle(u);
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
                // remove from list checked
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

    isChecked(row: any) {
        return this.isCheckAll == true || this.selection.isSelected(row);
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
