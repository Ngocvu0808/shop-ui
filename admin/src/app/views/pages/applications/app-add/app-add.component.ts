import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../../../service/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../../service/application.service';
import {ServiceService} from '../../../../service/service.service';

@Component({
    selector: 'mar-app-add',
    templateUrl: './app-add.component.html',
    styleUrls: ['./app-add.component.scss']
})
export class AppAddComponent implements OnInit {
    addForm: FormGroup;
    approveRequire: boolean;
    shareToken: boolean;
    mothodType: boolean;
    authTypeList = []
    loading: boolean = false;
    constructor(
        private dialogRef: MatDialogRef<AppAddComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private appService: ApplicationService,
        private serviceService: ServiceService,
        private notifyService: NotifyService,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.approveRequire = true;
        this.shareToken = false;
        this.initForm();
        this.getListAuthType()
    }

    initForm() {
        this.addForm = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            description: ['', Validators.compose([Validators.maxLength(1000)])],
            authType: ['', Validators.compose([Validators.required])],
            approveRequire: true,
            shareToken: false
        });
    }

    getListAuthType() {
        this.appService.getListAuthTypeApi().subscribe(res => {
            if (res && res.status) {
                this.authTypeList = res.data;
            }
        });
    }

    onSelectChange(event) {
        event.value == 'OAUTH' ? this.mothodType = true : this.mothodType = false;
    }

    save() {
        if (!this.addForm.valid) {
            this.addForm.markAllAsTouched();
            return;
        }
        const req = {
            name: this.addForm.controls.name.value,
            description: this.addForm.controls.description.value,
            auth_type: this.addForm.controls.authType.value,
            approve_require: this.approveRequire,
            share_token: this.shareToken
        };
        this.loading = true;
        try {
            this.appService.create(req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ADD'));
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
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ERROR'));
            this.loading = false;
        }
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.addForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    close() {
        this.dialogRef.close();
    }

    toggleApproveRequire(event) {
        this.approveRequire = !!event.checked;
    }

    toggleShareToken(event) {
        this.shareToken = !!event.checked;
    }
}
