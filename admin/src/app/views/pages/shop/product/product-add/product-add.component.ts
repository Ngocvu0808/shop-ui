import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../../../service/product.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'mar-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
    formAdd: FormGroup;
  constructor(
      private productService: ProductService,
      private dialogRef: MatDialogRef<ProductAddComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private notifyService: NotifyService,
      private fb: FormBuilder,
      private translate: TranslateService,
      private permissionService: PermissionService
  ) { }

  ngOnInit() {
      this.initForm();
  }
    initForm() {
        this.formAdd = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])], //  Validators.pattern('^(?!\\s+$).+')
            type: ['', Validators.compose([Validators.required, Validators.maxLength(255)])], // Validators.pattern('^(?!\\s+$).+')
            buyPrice: ['', Validators.compose([Validators.required, Validators.maxLength(255)])], // Validators.pattern('^(?!\\s+$).+')
        });
    }

    close() {
        this.dialogRef.close();
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.formAdd.controls[controlName];
        // console.log('------------validateForm', this.formAdd);
        if (!control) {
            return false;
        }
        return true;
        // return control.hasError(validationType) && (control.dirty || control.touched);
    }

    save() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.formAdd.valid) {
            this.formAdd.markAllAsTouched();
            return;
        }
        console.log(this.formAdd);
        const payload = this.formAdd.controls;
        console.log('-------------payload', payload);
        console.log('-------------payload', this.formAdd.controls);
        try {
            this.productService.create(payload).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('USER.ADD.SAVE_SUCCESS_MSG'));
                        this.dialogRef.close(res);
                        return;
                    }
                    // if (res.httpCode == 409) {
                    //     if (res.errorCode == '210020') {
                    //         this.formAdd.controls.username.setErrors({ duplidate: true });
                    //         return;
                    //     } else if (res.errorCode == '210021') {
                    //         this.formAdd.controls.email.setErrors({ duplidate: true });
                    //         return;
                    //     }
                    // } else {
                    //     if (res.httpCode != 403) {
                    //         this.notifyService.notify('ERROR', '', this.translate.instant('USER.ADD.ERROR_MSG'));
                    //     }
                    // }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('USER.ADD.ERROR_MSG'));
        }
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            console.log('----------------', fieldName, value);
            this.formAdd.controls[fieldName] = (value.toString().trim());
            return;
        }
    }
}
