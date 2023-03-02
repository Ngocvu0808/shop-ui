import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ConfigService} from '../../../../../service/config.service';

@Component({
    selector: 'kt-info-field-add',
    templateUrl: './info-field-add.component.html',
    styleUrls: ['./info-field-add.component.scss']
})
export class InfoFieldAddComponent implements OnInit {

    fieldAddForm: FormGroup;
    listTypeValue: any = '';

    loading = false;
    objects = [];

    constructor(
        private dialogRef: MatDialogRef<InfoFieldAddComponent>,
        private configService: ConfigService,
        private fb: FormBuilder,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private permissionService: PermissionService,
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.getTypeValue();
        this.getListObject();
    }

    initForm() {
        this.fieldAddForm = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            key: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z0-9_]+$')])],
            type: ['SYS'],
            object: ['', Validators.compose([Validators.required])],
            typeValue: ['', Validators.compose([Validators.required])],
            formatValue: ['', Validators.maxLength(255)],
            note: ['', Validators.maxLength(1000)],
        });
    }

    getTypeValue() {
        const req = {
            service: 'field_config',
            type: 'type_value'
        };
        this.configService.getTypeValueFieldConfig(req).subscribe(res => {
            if (res && res.status) {
                this.listTypeValue = res.data;
            }
        });
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.fieldAddForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    close() {
        this.dialogRef.close();
    }

    save() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.FIELD_CONFIG_ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.fieldAddForm.valid) {
            this.fieldAddForm.markAllAsTouched();
            return;
        }
        const body = {
            name: this.fieldAddForm.controls.name.value.toString().trim(),
            key: this.fieldAddForm.controls.key.value.toString().trim(),
            type: this.fieldAddForm.controls.type.value,
            typeValue: this.fieldAddForm.controls.typeValue.value,
            formatValue: this.fieldAddForm.controls.formatValue.value,
            object: this.fieldAddForm.controls.object.value,
            note: this.fieldAddForm.controls.note.value
        };
        this.loading = true;
        try {
            this.configService.addFieldConfig(body).subscribe(res => {
                if (res) {
                    this.loading = false;
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ADD'));
                        this.dialogRef.close(res);
                        return;
                    }
                    if (res.httpCode && res.httpCode === 409) {
                        this.notifyService.notify('WARN', '', this.translate.instant('FIELD.ADD.KEY_EXIST_ERROR'));
                        return;
                    }
                    if (res.httpCode !== 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            this.loading = false;
            this.notifyService.notify('ERROR', '', this.translate.instant('FIELD.ADD.ERROR_MESSAGE'));
        }
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.fieldAddForm.controls[fieldName].setValue(value.toString().trim());
            return;
        }
    }

    getListObject() {
        this.configService.getFieldObjects().subscribe(res => {
            if (res && res.status) {
                this.objects = res.data;
            }
        });
    }
}
