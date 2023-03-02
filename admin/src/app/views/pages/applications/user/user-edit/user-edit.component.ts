import {Component, Inject, OnInit} from '@angular/core';
import {NotifyService} from '../../../../../service/notify.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../../../service/application.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'mar-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
    formEdit: FormGroup;
    roleList: any = [];
    roles: any = [];
    isValidUser = false;
    isValidRole = false;
    validEmailMsg = '';
    userList: any;
    data: any;
    appId: any;
    loading: boolean = false;

    constructor(
        private appService: ApplicationService,
        private roleService: RoleService,
        private dialogRef: MatDialogRef<UserEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private notifyService: NotifyService,
        private fb: FormBuilder,
        private translate: TranslateService
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.getListRoleUser();
        this.initForm();
        this.getAllRoles();
    }

    initForm() {
        this.formEdit = this.fb.group({
            roles: this.fb.array([])
        });
    }

    getListRoleUser() {
        this.roles = this.data.item.permissions.map(role => role.roleId);
    }

    isCheck(id: number) {
        return this.roles.includes(id);
    }

    getAllRoles() {
        this.roleService.getAllRoleByObjectCode('APPLICATION').subscribe(res => {
            if (res && res.status) {
                this.roleList = res.data;
                const roles = <FormArray> this.formEdit.get('roles') as FormArray;
                this.roleList.forEach(it => {
                    if (it.defaultRole && it.defaultRole == true) {
                        roles.push(new FormControl(it.id));
                    }
                });
            }
        });
    }

    onChange(event) {
        if (event.checked) {
            this.roles.push(event.source.value);
        } else {
            this.roles = this.roles.filter(role => role != event.source.value);
        }
    }

    close() {
        this.dialogRef.close();
    }

    save() {
        if (this.roles.length == 0) {
            this.isValidRole = true;
            return;
        }
        const params = {
            id: this.data.item.appId,
            userId: this.data.item.id
        };
        const req = {
            role_ids: this.roles,
            user_id: this.data.item.id
        };
        this.loading = true;
        try {
            this.appService.updateUser(params, req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('APP.USER.EDIT.SUCCESS_MSG'));
                        this.dialogRef.close(res);
                        this.loading = false;
                        return;
                    } else {
                        if (res.httpCode != 403) {
                            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
                            this.loading = false;
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
            this.loading = false;
        }
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.formEdit.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    onChangeInput(fieldName: any, event: any) {
        const value = event.target.value;
        if (value) {
            this.formEdit.controls[fieldName].setValue(value.toString().trim());
            return;
        }
    }
}
