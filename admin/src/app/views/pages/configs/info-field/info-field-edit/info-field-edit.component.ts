import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import * as deepEqual from 'deep-equal';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ConfigService} from '../../../../../service/config.service';

@Component({
    selector: 'kt-info-field-edit',
    templateUrl: './info-field-edit.component.html',
    styleUrls: ['./info-field-edit.component.scss']
})
export class InfoFieldEditComponent implements OnInit {
    fieldFormEdit: FormGroup;
    data: any;
    listTypeValue: any = '';
    dataInit: any;
    loading = false;
    objects = [];

    constructor(private configService: ConfigService,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<InfoFieldEditComponent>,
                @Inject(MAT_DIALOG_DATA) data,
                private notifyService: NotifyService,
                private translate: TranslateService,
                private permissionService: PermissionService
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.initForm();
        this.getTypeValue();
        this.getListObject();
    }

    initForm() {
        this.fieldFormEdit = this.fb.group({
            name: [this.data.element.name, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^(?!\\s+$).+')])],
            key: [this.data.element.key],
            type: [this.data.element.type],
            object: [this.data.element.object, Validators.compose([Validators.required])],
            typeValue: [this.data.element.typeValue, Validators.compose([Validators.required])],
            formatValue: [this.data.element.formatValue, Validators.maxLength(255)],
            note: [this.data.element.note, Validators.maxLength(1000)],
        });
        this.dataInit = this.fieldFormEdit.getRawValue();
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

    edit() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.FIELD_CONFIG_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.fieldFormEdit.valid) {
            this.fieldFormEdit.markAllAsTouched();
            return;
        }
        const data = {
            name: this.fieldFormEdit.controls.name.value.toString().trim(),
            key: this.fieldFormEdit.controls.key.value.toString().trim(),
            type: this.fieldFormEdit.controls.type.value,
            typeValue: this.fieldFormEdit.controls.typeValue.value,
            formatValue: this.fieldFormEdit.controls.formatValue.value,
            object: this.fieldFormEdit.controls.object.value,
            note: this.fieldFormEdit.controls.note.value.toString().trim(),
        };
        if (deepEqual(data, this.dataInit)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.NO_CHANGE'));
            return;
        }
        this.loading = true;
        try {
            this.configService.updateFieldConfig(this.data.element.id, data).subscribe(res => {
                if (res) {
                    this.loading = false;
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_EDIT'));
                        this.dialogRef.close(res);
                        return;
                    } else {
                        if (res.http !== 403) {
                            this.notifyService.showError();
                        }
                    }
                }
            });
        } catch (e) {
            this.loading = false;
            console.log(e);
        }
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    validateForm(controlName: string, validationType: string): boolean {
        const control = this.fieldFormEdit.controls[controlName];
        if (!control) {
            return false;
        }

        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.fieldFormEdit.controls[fieldName].setValue(value.toString().trim());
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
