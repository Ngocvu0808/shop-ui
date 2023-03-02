import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as deepEqual from 'deep-equal';
import {TranslateService} from '@ngx-translate/core';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ConfigService} from '../../../../../service/config.service';

@Component({
    selector: 'kt-config-edit',
    templateUrl: './config-edit.component.html',
    styleUrls: ['./config-edit.component.scss']
})
export class ConfigEditComponent implements OnInit {
    configForm: FormGroup;
    data: any;
    dataInit: any;
    loading: boolean = false;

    constructor(private configService: ConfigService,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<ConfigEditComponent>,
                @Inject(MAT_DIALOG_DATA) data,
                private notifyService: NotifyService,
                private translate: TranslateService,
                private permissionService: PermissionService) {
        this.data = data;
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.configForm = this.fb.group({
            key: [this.data.element.key, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z0-9_]+$')])],
            value: [this.data.element.value, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^(?!\\s+$).+')])],
            note: [this.data.element.note, Validators.compose([Validators.maxLength(1000)])]
        });
        this.dataInit = this.configForm.getRawValue();
    }

    edit() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.SYSTEM_CONFIG_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.configForm.valid) {
            this.configForm.markAllAsTouched();
            return;
        }
        const data = {
            key: this.configForm.controls.key.value,
            value: this.configForm.controls.value.value.toString().trim(),
            note: this.configForm.controls.note.value.toString().trim()
        };
        if (deepEqual(data, this.dataInit)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.NOTHING_CHANGE'));
            return;
        }
        this.loading = true;
        try {
            this.configService.updateSysConfig(this.data.element.id, data).subscribe(res => {
                if (res) {
                    this.loading = false;
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('SYSTEM_CONFIG.EDIT.SUCCESS_MESSAGE'));
                        this.dialogRef.close(res);
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            this.loading = false;
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('SYSTEM_CONFIG.EDIT.ERROR_MESSAGE'));
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
        const control = this.configForm.controls[controlName];
        if (!control) {
            return false;
        }

        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.configForm.controls[fieldName].setValue(value.toString().trim());
            return;
        }
    }
}
