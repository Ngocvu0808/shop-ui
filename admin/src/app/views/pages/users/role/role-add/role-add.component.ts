import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {each} from 'lodash';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-role-add',
    templateUrl: './role-add.component.html',
    styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
    roleForm: FormGroup;
    permissions: any = [];
    roles: any = [];
    listPermissionByParent: any = [];
    defaultRole: boolean = false;
    duplicateKey: boolean = false;

    isValidPermission = false;
    msgValidPermission = '';
    isCheckAllRole: boolean = false;

    loading: boolean = false;

    listTypes: any;

    constructor(private dialogRef: MatDialogRef<RoleAddComponent>,
                private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private notifyService: NotifyService,
                private translate: TranslateService,
                private permissionService: PermissionService,
                private roleService: RoleService) {
    }

    ngOnInit() {
        this.getListTypes();
        this.getPermission();
        this.initForm();
    }

    initForm() {
        this.roleForm = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])], //Validators.pattern('^(?!\\s+$).+')
            code: ['', Validators.compose([Validators.required, Validators.maxLength(150), Validators.pattern('^[A-Za-z0-9_]+$')])],
            type: ['', Validators.required],
            defaultRole: [''],
            roles: this.fb.array([])
        });
    }

    checkAllRole(e) {
        e.preventDefault();
        this.isCheckAllRole = !this.isCheckAllRole;
        const listObjCode = [];
        this.permissions.map(item => {
            listObjCode.push(item.objectCode);
        });
        listObjCode.map(item => {
            const event = {
                checked: this.isCheckAllRole,
                source: {
                    value: item
                }
            };
            this.parentCheckChange(event);
        });
    }

    onChange(event) {
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        if (event.checked) {
            roles.push(new FormControl(event.source.value));
        } else {
            const i = roles.controls.findIndex(x => x.value === event.source.value);
            roles.removeAt(i);
        }
    }

    isChecked(id) {
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        return roles.getRawValue().includes(id);
    }

    isParentChecked(objectCode: any) {
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        const values = roles.getRawValue();
        const pers = [];
        const sysPermission = this.permissions.filter((value) => {
            return value.objectCode == objectCode;
        });
        if (sysPermission.length > 0) {
            if (sysPermission[0].sysPermissions != null) {
                sysPermission[0].sysPermissions.map((arr) => {
                    pers.push(arr.id);
                });
            }
        }
        let checker = (arr, target) => target.every(v => arr.includes(v));
        return checker(values, pers);
    }


    toggle(event) {
        this.defaultRole = !!event.checked;
    }

    parentCheckChange(event) {
        this.listPermissionByParent = [];
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        const parentValue = event.source.value;
        const permission = this.permissions.filter((value) => {
            return value.objectCode == parentValue;
        });
        if (permission.length > 0) {
            if (permission[0].sysPermissions != null) {
                permission[0].sysPermissions.map((arr) => {
                    this.listPermissionByParent.push(arr.id);
                });
            }
        }
        if (event.checked) {
            each(this.listPermissionByParent, it => {
                const i = roles.controls.findIndex(x => x.value === it);
                if (i == -1) {
                    roles.push(new FormControl(it));
                }
            });
        } else {
            each(this.listPermissionByParent, it => {
                const i = roles.controls.findIndex(x => x.value === it);
                roles.removeAt(i);
            });
        }
    }

    getPermission() {
        this.roleService.getAllPermission().subscribe(res => {
            if (res && res.status) {
                this.permissions = res.data;
                this.cdr.markForCheck();
            }
        });
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.roleForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    close() {
        this.dialogRef.close();
    }

    save() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.roleForm.markAllAsTouched();
        if (!this.roleForm.valid) {
            return;
        }

        const req = {
            code: this.roleForm.controls.code.value.toString().trim(),
            name: this.roleForm.controls.name.value.toString().trim(),
            type: this.roleForm.controls.type.value,
            default_role: this.defaultRole,
            permissions: this.roleForm.controls.roles.value,
        };

        if (!req.permissions || req.permissions.length == 0) {
            this.isValidPermission = true;
            this.msgValidPermission = this.translate.instant('ROLE.ADD.ROLE_CHECKED_REQUIRED');
            return;
        }
        this.isValidPermission = false;
        this.msgValidPermission = '';
        this.loading = true;
        try {
            this.roleService.create(req).subscribe(res => {
                if (res) {
                    this.loading = false;
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('ROLE.ADD.SUCCESS_MESSAGE'));
                        this.dialogRef.close(res);
                        return;
                    }
                    if (res.httpCode == 409) {
                        this.duplicateKey = true;
                        return;
                    }
                    this.notifyService.notify('WARN', '', res.message);
                }
            });
        } catch (e) {
            this.loading = false;
            this.notifyService.notify('SUCCESS', '', this.translate.instant('ROLE.ADD.ERROR_MESSAGE'));
        }
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.roleForm.controls[fieldName].setValue(value.toString().trim());
            return;
        }
    }

    getListTypes() {
        this.roleService.getListTypes().subscribe(res => {
            if (res && res.status) {
                this.listTypes = res.data;
                res.data.map(item => {
                    if (item.is_default) {
                        this.roleForm.controls.type.patchValue(item.id);
                    }
                });
            }
        });
    }
}
