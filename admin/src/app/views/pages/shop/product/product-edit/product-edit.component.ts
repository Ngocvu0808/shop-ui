import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceService} from "../../../../../service/service.service";
import {NotifyService} from "../../../../../service/notify.service";
import {TranslateService} from "@ngx-translate/core";
import {PermissionService} from "../../../../../core/_common/permission.service";
import {PERMISSION_CODE} from "../../../../../core/_common/config/permissionCode";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as deepEqual from 'deep-equal';
import {ProductService} from "../../../../../service/product.service";

@Component({
  selector: 'mar-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

    editForm: FormGroup;
    data: any;
    methodList: any = [];
    typeList: any = [];
    systemList: any = [];
    serviceList: any = [];

    services: Array<any> = [];

    isValueChange: boolean = false;
    dataInit: any;

    constructor(
        private dialogRef: MatDialogRef<ProductEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private productService: ProductService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private permissionService: PermissionService,
        private cdr: ChangeDetectorRef
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.editForm = this.fb.group({
            id: [this.data.element.id, Validators.compose([Validators.required, Validators.maxLength(255)])],
            name: [this.data.element.name, Validators.compose([Validators.required, Validators.maxLength(255)])],
            code: [this.data.element.code, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9_]+$')])],
            buyPrice: [this.data.element.buyPrice, Validators.compose([Validators.required])],
            type: [this.data.element.type, Validators.compose([Validators.maxLength(255)])],
            sellPrice: [this.data.element.sellPrice, Validators.compose([Validators.required])],
            source: [this.data.element.source, Validators.compose([Validators.required])],
        });
        this.dataInit = this.editForm.getRawValue();
    }



    onSystemChange() {
        const systemId = this.editForm.controls.system.value;
        this.serviceList = this.services.filter(it => systemId == it.systemId);
        this.editForm.controls.service.setValue(null);
        const formValue = this.editForm.getRawValue();
        this.isValueChange = !deepEqual(formValue, this.dataInit);
        this.cdr.markForCheck();
    }


    save() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.editForm.valid) {
            this.editForm.markAllAsTouched();
            return;
        }

        const req = {
            name: this.editForm.controls.name.value,
            buyPrice: this.editForm.controls.buyPrice.value,
            sellPrice: this.editForm.controls.sellPrice.value,
            source: this.editForm.controls.source.value
        };
        try {
            this.productService.update(this.data.element.id, req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ADD'));
                        this.dialogRef.close(res);
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

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.editForm.controls[fieldName].setValue(value.toString().trim());
        }
        const formValue = this.editForm.getRawValue();
        this.isValueChange = !deepEqual(formValue, this.dataInit);
        this.cdr.markForCheck();
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    validateForm(controlName: string, validationType: string): boolean {
        const control = this.editForm.controls[controlName];
        if (!control) {
            return false;
        }
        console.log('-----------', controlName, this.data.element.code, control);
        if (controlName == 'code' && !(this.data.element.code == control)) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    onSelectChange(event: any) {
        const formValue = this.editForm.getRawValue();
        this.isValueChange = !deepEqual(formValue, this.dataInit);
        this.cdr.markForCheck();
    }

}
