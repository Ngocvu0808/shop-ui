import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ServiceService} from '../../../../../service/service.service';

@Component({
    selector: 'mar-api-add',
    templateUrl: './api-add.component.html',
    styleUrls: ['./api-add.component.scss']
})
export class ApiAddComponent implements OnInit {
    addForm: FormGroup;
    methodList: any = [];
    typeList: any = [];
    systemList: any = [];
    serviceList: any = [];

    services: Array<any> = [];
    loading: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<ApiAddComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private layoutUtilsService: LayoutUtilsService,
        private fb: FormBuilder,
        private serviceService: ServiceService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private permissionService: PermissionService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.getListMethod();
        this.getListType();
        this.getListSystem();
        this.getListService();
        this.initForm();
    }

    initForm() {
        this.addForm = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            code: ['', Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9_]+$')])],
            api: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            method: ['', Validators.compose([Validators.required])],
            type: ['', Validators.compose([Validators.maxLength(255)])],
            system: [''],
            service: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.maxLength(1000)])],
        });
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

    save() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_API_ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.addForm.valid) {
            this.addForm.markAllAsTouched();
            return;
        }
        const req = {
            name: this.addForm.controls.name.value,
            code: this.addForm.controls.code.value,
            api: this.addForm.controls.api.value,
            method: this.addForm.controls.method.value,
            type: this.addForm.controls.type.value,
            service_id: this.addForm.controls.service.value,
            description: this.addForm.controls.description.value
        };
        this.loading = true;
        try {
            this.serviceService.createApi(req).subscribe(res => {
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
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            this.loading = false;
        }
    }

    close() {
        this.dialogRef.close();
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.addForm.controls[fieldName].setValue(value.toString().trim());
            return;
        }
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    validateForm(controlName: string, validationType: string): boolean {
        const control = this.addForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    onSystemChange() {
        const systemId = this.addForm.controls.system.value;
        this.serviceList = this.services.filter(it => systemId == it.systemId);
        this.addForm.controls.service.setValue(null);
        this.cdr.markForCheck();
    }
}
