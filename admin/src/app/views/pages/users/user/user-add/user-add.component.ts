import { Component, Inject, OnInit } from '@angular/core';
import { NotifyService } from '../../../../../service/notify.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PERMISSION_CODE } from '../../../../../core/_common/config/permissionCode';
import { PermissionService } from '../../../../../core/_common/permission.service';
import { UserService } from '../../../../../service/user.service';
import { RoleService } from '../../../../../service/role.service';

@Component({
    selector: 'kt-user-add',
    templateUrl: './user-add.component.html',
    styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
    formAdd: FormGroup;
    roleList: any = [];
    roles: any;
    isValidUser = false;
    validUserMsg = '';
    isValidEmail = false;
    validEmailMsg = '';

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private dialogRef: MatDialogRef<UserAddComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private notifyService: NotifyService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.getAllRoles();
    }

    initForm() {
        this.formAdd = this.fb.group({
            firstName: ['', Validators.compose([Validators.required, Validators.maxLength(255)])], //  Validators.pattern('^(?!\\s+$).+')
            lastName: ['', Validators.compose([Validators.required, Validators.maxLength(255)])], // Validators.pattern('^(?!\\s+$).+')
            username: ['', Validators.compose([Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern('^[A-Za-z0-9_.+-@%]+$')])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            roles: this.fb.array([])
        });
    }

    getAllRoles() {
        this.roleService.getAllRoleActive().subscribe(res => {
            if (res && res.status) {
                this.roleList = res.data;
                const roles = <FormArray>this.formAdd.get('roles') as FormArray;
                this.roleList.forEach(it => {
                    if (it.defaultRole && it.defaultRole == true) {
                        roles.push(new FormControl(it.id));
                    }
                });
            }
        });
    }

    onChange(event) {
        const roles = <FormArray>this.formAdd.get('roles') as FormArray;
        if (event.checked) {
            roles.push(new FormControl(event.source.value));
        } else {
            const i = roles.controls.findIndex(x => x.value === event.source.value);
            roles.removeAt(i);
        }
    }

    close() {
        this.dialogRef.close();
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
        const payload = {
            username: this.formAdd.controls.username.value.toString().trim(),
            first_name: this.formAdd.controls.firstName.value.toString().trim(),
            last_name: this.formAdd.controls.lastName.value.toString().trim(),
            email: this.formAdd.controls.email.value,
            password: '',
            roles: this.formAdd.controls.roles.value
        };
        try {
            this.userService.create(payload).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('USER.ADD.SAVE_SUCCESS_MSG'));
                        this.dialogRef.close(res);
                        return;
                    }
                    if (res.httpCode == 409) {
                        if (res.errorCode == '210020') {
                            this.isValidUser = true;
                            this.formAdd.controls.username.setErrors({ duplidate: true });
                            return;
                        } else if (res.errorCode == '210021') {
                            this.isValidEmail = true;
                            this.formAdd.controls.email.setErrors({ duplidate: true });
                            return;
                        }
                    } else {
                        if (res.httpCode != 403) {
                            this.notifyService.notify('ERROR', '', this.translate.instant('USER.ADD.ERROR_MSG'));
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('USER.ADD.ERROR_MSG'));
        }
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.formAdd.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.formAdd.controls[fieldName].setValue(value.toString().trim());
            return;
        }
    }

    isChecked(role: any) {
        const roles = <FormArray>this.formAdd.get('roles') as FormArray;
        return roles.value.includes(role.id);
    }
}
