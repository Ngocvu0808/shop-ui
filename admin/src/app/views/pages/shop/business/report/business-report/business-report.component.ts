import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
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
import {BusinessService} from '../../../../../../service/business.service';
@Component({
  selector: 'mar-business-report',
  templateUrl: './business-report.component.html',
  styleUrls: ['./business-report.component.scss']
})
export class BusinessReportComponent implements OnInit {
    constructor(
        public dialog: MatDialog,

        public businessService: BusinessService,
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
    public chart: any;

    displayedColumns: string[] = ['batch', 'productName', 'productType', 'amount', 'createDate', 'type'];
    users = [];
    page = 0;

    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];

    dataSource = [];

    searchValue: '';

    fromDate: any;
    toDate: any;
    // sort
    canAccess = true;
    loading = false;
    fromDateInvalid = false;
    fromDateInvalidMsg = '';
    toDateInvalid = false;
    toDateInvalidMsg = '';
    minDate: Date;

    allProductValues: string[] = [];
    allBalanceValue: string[] = [];

    //
    // var d = new Date();
    // d.setDate(d.getDate()-5);

    listDateReport: string[] = [];
    timeParam: string = '';

    ngOnInit() {
        this.getListDateReport();
        this.getAllBalanceValues();
        this.getAllProductValues();
        this.createChart();
        this.minDate = new Date(1900, 0, 1);
    }

    getAllProductValues() {
        const params = {
            time: this.timeParam
        };
        try {
            this.productService.getListProductValue(params).subscribe(res => {
                if (res) {
                    this.loading = false;
                    const data: Array<any> = res.data;
                    console.log('------------data', res.data);
                    data.forEach((it: { [x: string]: string }) => {
                        // @ts-ignore
                        this.allProductValues.push(it);
                    });
                }
            });
        } catch (e) {
            console.log(e);
            this.loading = false;
        }
        console.log('------------this.allProductValues',this.allProductValues);

    }

    getAllBalanceValues() {
        const params = {
            time: this.timeParam
        };
        try {
            this.businessService.getListBalance(params).subscribe(res => {
                if (res) {
                    this.loading = false;
                    const data: Array<any> = res.data;
                    data.forEach((it: { [x: string]: string }) => {
                        // @ts-ignore
                        this.allBalanceValue.push(it);
                    });
                }
            });
        } catch (e) {
            console.log(e);
            this.loading = false;
        }
    }
    createChart() {

        this.chart = new Chart('MyChart', {
            type: 'bar', // this denotes tha type of chart
            data: {// values on X-Axis
                labels: this.listDateReport,
                datasets: [
                    {
                        label: 'Balances',
                        data: this.allBalanceValue,
                        backgroundColor: 'blue'
                    },
                    {
                        label: 'Products',
                        data: this.allProductValues,
                        backgroundColor: 'limegreen'
                    }
                ]
            },
            options: {
                aspectRatio: 2.5
            }

        });
    }



    getListDateReport() {
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - 5 * i);
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0'); // January is 0!
            const yyyy = d.getFullYear();

            const today = dd + '-' + mm + '-' + yyyy;
            this.listDateReport.push(today.toString());
            this.timeParam += ',' + today;
        }
    }

    checkPermission(permission: any, objCode?: any, id?: any) {
        return !this.permissionService.canAccess(permission, objCode, id);
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
        this.router.navigate(['/business/trading']);
    }

}
