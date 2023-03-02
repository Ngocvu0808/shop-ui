import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../../../service/notify.service';
import { TranslateService } from '@ngx-translate/core';
import * as deepEqual from 'deep-equal';
import { ApplicationService } from '../../../../service/application.service';
import { ServiceService } from '../../../../service/service.service';

@Component({
    selector: 'mar-app-edit',
    templateUrl: './app-edit.component.html',
    styleUrls: ['./app-edit.component.scss']
})
export class AppEditComponent implements OnInit {
    editForm: FormGroup;
    data: any;
    dataInit: any;
    approveRequire: boolean;
    shareToken: boolean;
    authTypeType: boolean;
    changeAuthType: boolean = false;
    authTypeList = [
        { name: 'OAUTH', description: 'OAuth2' },
        { name: 'API_KEY', description: 'API Key' }
    ];
    loading: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<AppEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private appService: ApplicationService,
        private serviceService: ServiceService,
        private notifyService: NotifyService,
        private translate: TranslateService
    ) {
        this.data = data;
        this.data.appDetail.auth_type == 'OAUTH' ? this.authTypeType = true : this.authTypeType = false;
    }

    ngOnInit() {
        this.editForm = this.fb.group({
            name: [this.data.appDetail.name, Validators.compose([Validators.required, Validators.maxLength(255)])],
            description: [this.data.appDetail.description, Validators.compose([Validators.maxLength(1000)])],
            authType: [this.data.appDetail.auth_type, Validators.compose([Validators.required])],
            approveRequire: this.data.appDetail.approve_require,
            shareToken: this.data.appDetail.share_token,

        });
        this.dataInit = this.editForm.getRawValue();
        // this.approveRequire = this.data.appDetail.approve_require;
        // this.shareToken = this.data.appDetail.share_token;

        this.getListMethod()
    }

    getListMethod() {
        this.appService.getListAuthTypeApi().subscribe(res => {
            if (res && res.status) {
                this.authTypeList = res.data;
            }
        });
    }

    onSelectChange(event) {
        event.value == this.data.appDetail.auth_type ? this.changeAuthType = false : this.changeAuthType = true;
        event.value == 'OAUTH' ? this.authTypeType = true : this.authTypeType = false;
    }

    save() {
        if (!this.editForm.valid) {
            this.editForm.markAllAsTouched();
            return;
        }

        const payload = {
            name: this.editForm.controls.name.value,
            description: this.editForm.controls.description.value,
            auth_type: this.editForm.controls.authType.value,
            approve_require: this.editForm.controls.approveRequire.value,
            share_token: this.editForm.controls.shareToken.value,
        };
        if (deepEqual(payload, this.dataInit)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.NO_CHANGE'));
            return;
        }
        this.loading = true;
        try {
            this.appService.update(this.data.appDetail.id, payload).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_EDIT'));
                        this.dialogRef.close(res);
                        this.loading = false;
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                        this.loading = false;
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ERROR'));
            this.loading = false;
        }
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.editForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    close() {
        this.dialogRef.close();
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.editForm.controls[fieldName].setValue(value.toString().trim());
            return;
        }
    }

    toggleApproveRequire(event) {
        this.approveRequire = !!event.checked;
    }

    toggleShareToken(event) {
        this.shareToken = !!event.checked;
    }
}
