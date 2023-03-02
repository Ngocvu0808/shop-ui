import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as deepEqual from 'deep-equal';
import {TranslateService} from '@ngx-translate/core';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {GroupService} from '../../../../../service/group.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-group-user-edit',
    templateUrl: './group-edit.component.html',
    styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
    data: any;
    dataInit: any;
    formEdit: FormGroup;
    roles: any = [];
    listGroupRoleId: any = [];

    constructor(
        private groupService: GroupService,
        private roleService: RoleService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<GroupEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private permissionService: PermissionService
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.initForm();
        this.getAllRole();
        this.getGroupRoleById(this.data.element.id);
        this.dataInit = this.formEdit.getRawValue();
        this.dataInit['roleIds'] = this.listGroupRoleId.sort();
        delete this.dataInit['roles'];
    }

    initForm() {
        this.formEdit = this.fb.group({
            name: [this.data.element.name, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^(?!\\s+$).+')])],
            code: [this.data.element.code, Validators.compose([Validators.required, Validators.maxLength(150), Validators.pattern('^[A-Za-z0-9_]+$')])],
            roles: this.fb.array([])
        });
    }

    //Lay danh sach tat ca cac vai tro hien co trong he thong
    getAllRole() {
        this.roleService.getAllRoleActive().subscribe(res => {
            if (res && res.status) {
                this.roles = res.data;
            }
        });
    }

    //Lấy danh sách vai trò của nhóm người dùng được chọn theo Id
    getGroupRoleById(groupId) {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.GET_ALL_ROLE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const roles = <FormArray> this.formEdit.get('roles') as FormArray;
        this.groupService.getRoleOfGroup(groupId).subscribe(res => {
            if (res && res.status) {
                const dataGroupRole: Array<any> = res.data;
                this.listGroupRoleId = dataGroupRole.map(role => role.id);
                for (let id of this.listGroupRoleId) {
                    roles.push(new FormControl(id));
                }
            }
        });
    }

    getCheckedRole(roleId) {
        if (this.listGroupRoleId.indexOf(roleId) != -1) {
            return true;
        }
    }

    onChange(event) {
        const roles = <FormArray> this.formEdit.get('roles') as FormArray;
        if (event.checked) {
            roles.push(new FormControl(event.source.value));
        } else {
            const i = roles.controls.findIndex(x => x.value === event.source.value);
            roles.removeAt(i);
        }
    }

    edit() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.formEdit.valid) {
            this.formEdit.markAllAsTouched();
            return;
        }
        const data = {
            name: this.formEdit.controls.name.value,
            code: this.formEdit.controls.code.value,
            roleIds: this.formEdit.controls.roles.value
        };
        data['roleIds'] = data.roleIds.sort();
        if (deepEqual(data, this.dataInit)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.NO_CHANGE'));
            return;
        }
        try {
            this.groupService.update(this.data.element.id, data).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_EDIT'));
                        this.dialogRef.close(res);
                        return;
                    } else {
                        if (res.httpCode != 403) {
                            this.notifyService.notify('WARN', '', res.message);
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('SYSTEM_CONFIG.EDIT.ERROR_MESSAGE'));
        }
    }

    close() {
        this.dialogRef.close();
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.formEdit.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

}
