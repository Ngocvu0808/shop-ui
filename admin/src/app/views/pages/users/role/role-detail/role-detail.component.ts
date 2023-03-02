import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-role-detail',
    templateUrl: './role-detail.component.html',
    styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {
    defaultRole: boolean = false;
    roleForm: FormGroup;
    data: any;
    permissions: any = [];
    listIdPermissions: any = [];
    listTypes: any;

    constructor(private roleService: RoleService,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<RoleDetailComponent>,
                @Inject(MAT_DIALOG_DATA) data,
                private permissionService: PermissionService,
                private notifyService: NotifyService,
                private translate: TranslateService) {
        this.data = data;
    }

    ngOnInit() {
        this.getListTypes();
        this.roleForm = this.fb.group({
            name: [this.data.element.name, Validators.compose([Validators.required])],
            code: [this.data.element.code, Validators.compose([Validators.required])],
            type: ['', Validators.compose([Validators.required])],
            defaultRole: [Boolean(this.data.element.defaultRole)],
            roles: this.fb.array([])
        });
        this.defaultRole = this.data.element.defaultRole;
        this.getPermission();
        this.getPermissionByRoleId(this.data.element.id);
    }

    isParentChecked(objectCode: any) {
        const roles = <FormArray> this.roleForm.get('roles') as FormArray;
        const values = roles.getRawValue();
        const permissions = [];
        const sysPermission = this.permissions.filter((value) => {
            return value.objectCode == objectCode;
        });
        sysPermission[0].sysPermissions.map((arr) => {
            permissions.push(arr.id);
        });
        let checker = (arr, target) => target.every(v => arr.includes(v));
        return checker(values, permissions);
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

    getPermission() {
        this.roleService.getAllPermission().subscribe(res => {
            if (res && res.status) {
                this.permissions = res.data;
            }
        });
    }

    getPermissionByRoleId(roleId) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.ROLE.GET_BY_ID)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
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

    getCheckedRole(roleId) {
        if (this.listIdPermissions.indexOf(roleId) != -1) {
            return true;
        }
    }

    close() {
        this.dialogRef.close();
    }

    getListTypes() {
        this.roleService.getListTypes().subscribe(res => {
            if (res && res.status) {
                this.listTypes = res.data;
            }
        });
    }
}
