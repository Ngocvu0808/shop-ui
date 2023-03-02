import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {LayoutUtilsService} from '../../../../../../core/_base/crud';
import {UserService} from '../../../../../../service/user.service';
import {ProductService} from '../../../../../../service/product.service';
import {RoleService} from '../../../../../../service/role.service';
import {Router} from '@angular/router';
import {NotifyService} from '../../../../../../service/notify.service';
import {PermissionService} from '../../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../../core/_common/config/permissionCode';
import {ProductDetailComponent} from '../../../product/product-detail/product-detail.component';
import {Sort} from '@angular/material/sort';
import {ProductAddComponent} from "../../../product/product-add/product-add.component";

@Component({
  selector: 'mar-trading-list',
  templateUrl: './trading-list.component.html',
  styleUrls: ['./trading-list.component.scss']
})
export class TradingListComponent implements OnInit {


    displayedColumns: string[] = ['batch', 'productName', 'productCode', 'amount', 'createDate', 'type'];
    users = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    currentUserId: any;
    dataSource = [];
    startDate: string;
    endDate: string;
    // Filter
    statusValues: Array<any> = ['BUYING', 'SELLING'];
    searchValue: '';
    listStatusFilter: Array<any> = [];
    listStatusValue: Array<any> = [];

    // Checkbox Table
    selection = new SelectionModel<any>(true, []);
    selected: Array<any> = [];
    isCheckAll = false;
    poolSelect: Array<any> = [];
    unSelect: Array<any> = [];
    fromDate: any;
    toDate: any;
    // sort
    sortActive = '';
    sortDirection = '';

    allLabel = 'Tất cả';
    canAccess = true;
    loading = false;
    fromDateInvalid = false;
    fromDateInvalidMsg = '';
    toDateInvalid = false;
    toDateInvalidMsg = '';
    minDate: Date;
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
        this.listStatusValue = ['SELLING', 'BUYING'];
        this.statusValues = ['SELLING', 'BUYING'];
        this.cdr.markForCheck();
        this.fetchUsers();
        this.minDate = new Date(1900, 0, 1);
    }


    // getStatusFilter() {
    //     this.userService.getListStatusUser().subscribe(res => {
    //         if (res && res.status) {
    //             this.listStatusFilter = res.data;
    //             this.listStatusValue = this.listStatusFilter.map(item => item.name);
    //             this.statusValues = this.listStatusValue;
    //             this.cdr.markForCheck();
    //         }
    //     });
    // }

    fetchUsers() {
        this.selection.clear();
        this.getProducts(this.page + 1, this.limit);
    }

    search() {
        this.page = 0;
        this.fetchUsers();
    }

    getProducts(page: number, limit: number) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.TRADING.GETALL)) {
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
            startDate: this.getFormattedDate(this.fromDate),
            endDate: this.getFormattedDate(this.toDate),
            sort: sortValue,
        };
        this.loading = true;
        try {
            this.productService.getAllTrade(params).subscribe(res => {
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

    pageChange(event: any) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getProducts(this.page + 1, this.limit);
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

    getFormattedDate(date): string {
        if (date != undefined) {
            console.log(date);
            const year = date.getFullYear();

            let month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;

            let day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;

            return year + '-' + month + '-' + day;
        }
        return '';
    }
    onMasterStatusSelectChange(event: any) {
        this.statusValues = event;
        this.search();
    }

    validateFromDate(type, event) {
        if (event.targetElement.value == '') {
            this.fromDateInvalid = false;
            return;
        }
        if (event.value == null) {
            this.fromDateInvalid = true;
            this.fromDateInvalidMsg = this.translate.instant('APP.LOG_HISTORY.DATE_INVALID');
            this.cdr.markForCheck();
            return;
        }
        this.fromDateInvalid = false;
    }
    checkValidFromDate(fromDate) {
        if (fromDate != null && fromDate != '') {
            if (new Date(fromDate).getTime() > new Date().getTime()) {
                return false;
            }
        }
        return true;
    }

    validateToDate(type, event) {
        if (event.targetElement.value == '') {
            this.toDateInvalid = false;
            return;
        }
        if (event.value == null) {
            this.toDateInvalid = true;
            this.toDateInvalidMsg = this.translate.instant('APP.LOG_HISTORY.DATE_INVALID');
            this.cdr.markForCheck();
            return;
        }
        this.fetchData();
        this.toDateInvalid = false;
    }

    getMsgValidateFromDate(fromDate) {
        if (fromDate != null && fromDate != '') {
            if (new Date(fromDate).getTime() > new Date().getTime()) {
                return this.translate.instant('APP.LOG_HISTORY.FROM_DATE_GT_CURRENT_DATE');
            }
        }
        return '';
    }

    getMsgValidateToDate(fromDate, toDate) {
        if (toDate != null && toDate != '') {
            if (new Date(toDate).getTime() > new Date().getTime()) {
                return this.translate.instant('APP.LOG_HISTORY.TO_DATE_GT_CURRENT_DATE');
            }
            if (fromDate != null) {
                if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
                    return this.translate.instant('APP.LOG_HISTORY.TO_DATE_GT_FROM_DATE');
                }
            }
        }
        return '';
    }
    checkValidToDate(fromDate, toDate) {
        if (toDate != null && toDate != '') {
            if (new Date(toDate).getTime() > new Date().getTime()) {
                return false;
            }
            if (fromDate != null) {
                if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
                    return false;
                }
            }
        }
        return true;
    }

    addProduct() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.PRODUCT.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.router.navigate(['/business/business']);
    }
}
