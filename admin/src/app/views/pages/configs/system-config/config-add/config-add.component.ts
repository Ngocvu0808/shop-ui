import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {ConfigService} from '../../../../../service/config.service';

@Component({
    selector: 'kt-config-edit',
    templateUrl: './config-add.component.html',
    styleUrls: ['./config-add.component.scss']
})
export class ConfigAddComponent implements OnInit {
    configForm: FormGroup;
    loading: boolean = false;

    constructor(private configService: ConfigService,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<ConfigAddComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private notifyService: NotifyService,
                private translate: TranslateService,
                private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.configForm = this.fb.group({
            key: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z0-9_]+$')])],
            value: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],// Validators.pattern('^(?!\\s+$).+')
            note: ['', Validators.compose([Validators.maxLength(1000)])]
        });
    }

    add() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.CONFIG.SYSTEM_CONFIG_ADD)) {
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
        this.loading = true;
        try {
            this.configService.addSysConfig(data).subscribe(res => {
                if (res) {
                    this.loading = false;
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('SYSTEM_CONFIG.ADD.SUCCESS_MESSAGE'));
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
            this.notifyService.notify('ERROR', '', this.translate.instant('SYSTEM_CONFIG.ADD.ERROR_MESSAGE'));
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
