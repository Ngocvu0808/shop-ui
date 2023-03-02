import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../../../../service/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../../../service/application.service';

@Component({
    selector: 'mar-service-register',
    templateUrl: './service-register.component.html',
    styleUrls: ['./service-register.component.scss']
})
export class ServiceRegisterComponent implements OnInit {

    registForm: FormGroup;
    dataSource: Array<any> = [];
    filterStatus: Array<any> = [];
    status_value: Array<any> = [];
    search_value: any = '';
    allLabel: any = '';
    // sort
    sortActive = '';
    sortDirection = '';
    canAccess: boolean = true;
    data: any;
    apiId: any;
    appId: any;

    constructor(
        private dialogRef: MatDialogRef<ServiceRegisterComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private appService: ApplicationService,
        private notifyService: NotifyService,
        private translate: TranslateService,
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.initForm();
        this.apiId = this.data.item.id;
        this.appId = this.data.item.appID;
    }

    initForm() {
        this.registForm = this.fb.group({
            desc: ['', Validators.compose([Validators.required, Validators.maxLength(1000), Validators.pattern('.*[^ ].*')])],
        });
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.registForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'APPROVED':
                return 'status-active';
            case 'REJECTED':
                return 'status-deactive';
            case 'REQUESTING':
                return 'status-pending';
        }
        return '';
    }

    register() {
        if (!this.registForm.valid) {
            this.registForm.markAllAsTouched();
            return;
        }
        const req = {
            id: this.apiId,
            purpose: this.registForm.controls.desc.value,
        };
        try {
            this.appService.addApi(this.appId, req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('APP.SERVICE.REGISTER.SUCCESS_MESSAGE'));
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
            this.notifyService.notify('ERROR', '', this.translate.instant('APP.SERVICE.REGISTER.ERROR_MESSAGE'));
        }
    }

    close() {
        this.dialogRef.close();
    }
}
