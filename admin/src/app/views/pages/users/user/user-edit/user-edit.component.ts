import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import * as deepEqual from 'deep-equal';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {UserService} from '../../../../../service/user.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
    data: any;
    roleList: Array<any> = [];
    roles: Array<any> = [];
    dataInit: any = [];

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private dialogRef: MatDialogRef<UserEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private translate: TranslateService,
        private permissionService: PermissionService
    ) {
        this.data = data.element;
    }

    ngOnInit() {
        this.initRoleUser();
        this.getAllRoles();
    }

    initRoleUser() {
        if (this.data.roles) {
            this.roles = this.data.roles.map(role => role.id);
            this.dataInit = this.data.roles.map(role => role.id);
            this.cdr.markForCheck();
        }
    }

    getAllRoles() {
        this.roleService.getAllRoleActive().subscribe(res => {
            if (res && res.status) {
                this.roleList = res.data;
                this.cdr.markForCheck();
            }
        });
    }

    isCheck(id: number) {
        return this.roles.includes(id);
    }

    close() {
        this.dialogRef.close();
    }

    save() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.USER.UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        const payload = this.roles.filter(role => this.roleList.some(r => r.id == role));
        console.log(this.dataInit);
        console.log(payload);
        console.log(deepEqual(payload.sort(), this.dataInit.sort()));
        if (deepEqual(payload.sort(), this.dataInit.sort())) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.NO_CHANGE'));
            return;
        }
        try {
            this.userService.updateRole(this.data.id, payload).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_EDIT'));
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
            this.notifyService.notify('ERROR', '', this.translate.instant('USER.EDIT.ERROR_MSG'));
        }
    }

    onChange(event) {
        if (event.checked) {
            this.roles.push(event.source.value);
        } else {
            this.roles = this.roles.filter(role => role != event.source.value);
        }
        this.cdr.markForCheck();
    }
}
