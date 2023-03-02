import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {each} from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import * as deepEqual from 'deep-equal';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

    roleForm: FormGroup;
    data: any;
    permissions: Array<any> = [];
    listIdPermissions: Array<any> = [];
    listPermissionByParent: Array<any> = [];
    defaultRole: boolean = false;
    isValidPermission = false;
    msgValidPermission = '';
    dataInit: any;
    isCheckAllRole: boolean = false;

    loading: boolean = false;
    listTypes: any;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<RoleEditComponent>,
                @Inject(MAT_DIALOG_DATA) data,
                private notifyService: NotifyService,
                private translate: TranslateService,
                private permissionService: PermissionService,
                private roleService: RoleService) {
        this.data = data;
    }

    ngOnInit() {
        this.getListTypes();
        this.roleForm = this.fb.group({
            name: [this.data.element.name, Validators.compose([Validators.required, Validators.maxLength(255)])], //Validators.pattern('^(?!\\s+$).+')
            code: [this.data.element.code, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z0-9_]+$')])],
            type: ['', Validators.required],
            defaultRole: [this.data.element.defaultRole],
            roles: this.fb.array([])
        });
        this.defaultRole = this.data.element.defaultRole;
        this.getPermission();
        this.getPermissionByRoleId(this.data.element.id);
        this.dataInit = this.roleForm.getRawValue();
        this.dataInit['permissions'] = this.listIdPermissions;
        delete this.dataInit['roles'];
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
        this.isCheckAllRole = this.permissions.length == roles.length;
    }

    isParentChecked(objectCode: any) {
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        const values = roles.getRawValue();
        const pers = [];
        const sysPermission: Array<any> = this.permissions.filter((value) => {
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

    parentCheckChange(event) {
        this.listPermissionByParent = [];
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        const parentValue = event.source.value;
        const permission: Array<any> = this.permissions.filter((value) => {
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
            }
        });
    }

    getPermissionByRoleId(roleId) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            return;
        }
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        this.roleService.getById(roleId).subscribe(res => {
            if (res && res.status) {
                this.roleForm.controls.type.patchValue(res.data.type);
                const listPermissions = res.data.permissions;
                listPermissions.map((per) => {
                    per.sysPermissions.map((item) => {
                        this.listIdPermissions.push(item.id);
                    });
                });
                for (let id of this.listIdPermissions) {
                    roles.push(new FormControl(id));
                }
            }
        });
    }

    isChecked(id) {
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        return roles.getRawValue().includes(id);
    }

    getCheckedRole(roleId) {
        if (this.listIdPermissions.indexOf(roleId) != -1) {
            return true;
        }
    }

    toggle(event) {
        if (event.checked) {
            this.defaultRole = true;
        } else {
            this.defaultRole = false;
        }
    }

    edit() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        // if (!this.roleForm.valid) {
        //     console.log('-----------------!this.roleForm.valid', this.findInvalidControls());
        //     this.roleForm.markAllAsTouched();
        //     return;
        // }
        const req = {
            code: this.roleForm.controls.code.value.toString().trim(),
            name: this.roleForm.controls.name.value.toString().trim(),
            type: this.roleForm.controls.type.value,
            default_role: this.defaultRole,
            permissions: this.roleForm.controls.roles.value,
        };
        if (!req.permissions || req.permissions.length == 0) {
            this.isValidPermission = true;
            this.msgValidPermission = this.translate.instant('ROLE.EDIT.PERMISSION_REQUIRED');
            return;
        }
        this.isValidPermission = false;
        this.msgValidPermission = '';
        req['permissions'] = req.permissions.sort();
        this.dataInit['permissions'] = this.dataInit.permissions.sort();
        if (deepEqual(req, this.dataInit)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.NO_CHANGE'));
            return;
        }
        this.loading = true;
        try {
            console.log('tryyyyyyyyyyyyyyyyyyy');
            this.roleService.update(this.data.element.id, req).subscribe(res => {
                if (res) {
                    this.loading = false;
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('ROLE.EDIT.SUCCESS_MESSAGE'));
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
            this.notifyService.notify('SUCCESS', '', this.translate.instant('ROLE.EDIT.ERROR_MESSAGE'));
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
        const control = this.roleForm.controls[controlName];
        if (!control) {
            return false;
        }

        return control.hasError(validationType) && (control.dirty || control.touched);
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
            }
        });
    }

    public findInvalidControls() {
        const invalid = [];
        const controls = this.roleForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }
}
