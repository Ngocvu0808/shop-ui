import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ServiceService} from "../../../../../service/service.service";
import {NotifyService} from "../../../../../service/notify.service";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "../../../../../service/product.service";

@Component({
  selector: 'mar-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

    apiId: any;
    apiDetail: any = {};

    constructor(
        private dialogRef: MatDialogRef<ProductDetailComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private serviceService: ProductService,
        private notifyService: NotifyService,
        private translate: TranslateService
    ) {
        this.apiId = data.element.id;
    }

    ngOnInit() {
        this.getApiDetail();
    }

    getApiDetail() {
        try {
            this.serviceService.getById(this.apiId).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.apiDetail = res.data;
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
        }
    }

    close() {
        this.dialogRef.close();
    }

}
