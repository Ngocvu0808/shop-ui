import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartItem} from '../cart.model';
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
import {environment} from '../../../../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
    selector: 'mar-selling',
    templateUrl: './selling.component.html',
    styleUrls: ['./selling.component.scss']
})
export class SellingComponent implements OnInit {

    displayedColumns: string[] = ['name', 'code', 'sellPrice', 'type', 'amount'];
    formData: any[] = [];
    customer: string;
    users = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    currentUserId: any;
    dataSource = [];
    // Filter
    statusValues: Array<any> = ['BUYING', 'SELLING'];
    searchValue: '';
    listStatusFilter: Array<any> = [];
    listStatusValue: Array<any> = [];
    idAmount: string;
    tradingType: string;
    customerName: string;
    tradingTypeList: string[];
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
    idProducts: string;
    allLabel = 'Tất cả';
    canAccess = true;
    loading = false;
    amountSeted: string;
    minDate: Date;

    billValue: number;

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
        private fb: FormBuilder,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.tradingTypeList = ['BUYING', 'SELLING'];
        this.initIdProducts();
        this.cdr.markForCheck();
        this.fetchUsers();
        this.setBillValue();

    }

    initIdProducts() {
        const idMatch = localStorage.getItem(environment.ID_PICKED);
        const division = idMatch.split(',');
        if (division.length == 0) {
            this.idProducts = '';
        }
        console.log('---------------idMatch', division.length);
        for (let i = 0; i < division.length; i++) {
            const each = division[i];
            if (!each.includes('A')) {
                console.log('this.idProducts += \',\' + division[i];', each);
                this.idProducts += ',' + each;
                this.idAmount += ',' + each + '-1';
            }
        }
    }

    fetchUsers() {
        this.selection.clear();
        this.getProducts();
    }

    setBillValue() {
        this.billValue = 0;
        if (this.users.length == 0) {
            this.billValue = 0;
            return;
        }
        for (let i = 0; i < this.users.length; i++) {
            const each = this.users[i];
            this.billValue += each.amount * each.sellPrice;
        }
    }

    getAmount(id: string): string {
        const division = this.idAmount.split(',');
        for (let i = 0; i < division.length; i++) {
            const each = division[i];
            if (each.startsWith(id + '-')) {
                const divEach = each.split('-');
                return divEach[1];
            }
        }
        return '1';
    }

    search() {
        this.fetchUsers();
    }

    getProducts() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.TRADING.GETALL)) {
            // this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const params = {
            ids: this.idProducts
        };
        console.log('----------params', params);
        this.loading = true;
        try {
            this.productService.getByIdIn(params).subscribe(res => {
                if (res) {
                    this.loading = false;
                    const data: Array<any> = res.data;
                    console.log(res.data);
                    data.forEach((it: { [x: string]: string }) => {
                        it.actions = '';
                        it.amount = this.getAmount(it.id);
                        // @ts-ignore
                        this.billValue += it.amount * it.sellPrice;
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

    clickPlus(element: any) {
        console.log(element);
        this.updateUser(element);
        this.setBillValue();
    }

    updateUser(element: any) {
        this.users = this.users.filter(t => t.id != element.id);
        this.users.push(element);
    }

    pageChange(event: any) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getProducts();
    }

    checkOut() {
        this.setFormData();
        this.checkIsCurrentUser();
        const formTrading = this.fb.group({
            userId: this.currentUserId ? this.currentUserId : '',
            source: this.customerName ? this.customerName : '',
            products: this.users
        });
        // tslint:disable-next-line:no-unused-expression
        // @ts-ignore
        formTrading.controls.userId = this.currentUserId ? this.currentUserId : '';
        // @ts-ignore
        formTrading.controls.source = this.customerName ? this.customerName : '';
        // @ts-ignore
        formTrading.controls.products = this.users;
        const dialogRef = this.layoutUtilsService.deleteElement('Xác nhận thanh toán', 'Xác nhận thanh toán', 'Đang thanh toán!');
        console.log('--------------', this.tradingType, formTrading);

        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            try {
                localStorage.removeItem(environment.ID_PICKED);
                if (this.tradingType == 'SELLING') {
                    this.productService.sell(formTrading.controls).subscribe(res => {
                        if (res) {
                            if (res.status) {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('USER.ADD.SAVE_SUCCESS_MSG'));
                                this.router.navigate(['/product/list']);
                                return;
                            } else {
                                this.notifyService.notify('ERROR', '', res.message);
                                return;
                            }
                        }
                    });
                } else {
                    this.productService.buy(formTrading.controls).subscribe(res => {
                        if (res) {
                            if (res.status) {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('Thành công'));
                                this.router.navigate(['/product/list']);
                                return;
                            } else {
                                this.notifyService.notify('ERROR', '', res.message);
                                return;
                            }
                        }
                    });
                }
            } catch (e) {
                console.log(e);
                this.notifyService.notify('ERROR', '', this.translate.instant('USER.USER_MANAGE.ERROR_MSG'));
            }
        });
        this.notifyService.notify('FAILED', '', this.translate.instant('Thất bại'));
        localStorage.removeItem(environment.ID_PICKED);
    }

    onSelectChange(event) {
        if (event.value == 'SELLING')
            this.tradingType = 'SELLING';
        if (event.value == 'BUYING')
            this.tradingType = 'BUYING';
    }
    setFormData() {
        if (this.users.length == 0) {
            return [];
        }
        for (let i = 0; i < this.users.length; i++) {
            const each = this.users[i];
            const eachData = {
                id: Number(each.id),
                amount: Number(each.amount)
            };
            this.formData.push(eachData);
        }
    }

    isChecked(row: any) {
        return this.isCheckAll == true || this.selection.isSelected(row);
    }

    checkIsCurrentUser() {
        this.currentUserId = this.permissionService.getCurrentUserId();
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


    addProduct() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.PRODUCT.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.router.navigate(['/product/list']);
    }

}
