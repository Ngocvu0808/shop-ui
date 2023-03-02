import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import * as deepEqual from 'deep-equal';
import {ServiceService} from '../../../../../service/service.service';

@Component({
    selector: 'mar-api-edit',
    templateUrl: './api-edit.component.html',
    styleUrls: ['./api-edit.component.scss']
})
export class ApiEditComponent implements OnInit {
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
        private dialogRef: MatDialogRef<ApiEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private serviceService: ServiceService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private permissionService: PermissionService,
        private cdr: ChangeDetectorRef
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.getListMethod();
        this.getListType();
        this.getListSystem();
        this.getListService();
        this.initForm();
    }

    initForm() {
        this.editForm = this.fb.group({
            name: [this.data.element.name, Validators.compose([Validators.required, Validators.maxLength(255)])],
            code: [this.data.element.code, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9_]+$')])],
            api: [this.data.element.api, Validators.compose([Validators.required, Validators.maxLength(255)])],
            method: [this.data.element.method, Validators.compose([Validators.required])],
            type: [this.data.element.type, Validators.compose([Validators.maxLength(255)])],
            system: [this.data.element.system.id, Validators.compose([Validators.required])],
            service: [this.data.element.service.id, Validators.compose([Validators.required])],
            description: [this.data.element.description, Validators.compose([Validators.maxLength(1000)])],
        });
        this.dataInit = this.editForm.getRawValue();
    }

    getListMethod() {
        this.serviceService.getListMethodApi().subscribe(res => {
            if (res && res.status) {
                this.methodList = res.data;
            }
        });
    }

    getListType() {
        this.serviceService.getListTypeApi().subscribe(res => {
            if (res && res.status) {
                this.typeList = res.data;
            }
        });
    }

    getListSystem() {
        this.serviceService.getSystems().subscribe(res => {
            if (res && res.status) {
                this.systemList = res.data;
            }
        });
    }

    getListService() {
        this.serviceService.getAllServiceNoPaging().subscribe(res => {
            if (res && res.status) {
                this.serviceList = res.data;
                this.services = res.data;
            }
        });
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
            code: this.editForm.controls.code.value,
            api: this.editForm.controls.api.value,
            method: this.editForm.controls.method.value,
            type: this.editForm.controls.type.value,
            system: this.editForm.controls.system.value,
            service_id: this.editForm.controls.service.value,
            description: this.editForm.controls.description.value,
        };
        try {
            this.serviceService.updateApi(this.data.element.id, req).subscribe(res => {
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
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    onSelectChange(event: any) {
        const formValue = this.editForm.getRawValue();
        this.isValueChange = !deepEqual(formValue, this.dataInit);
        this.cdr.markForCheck();
    }
}
