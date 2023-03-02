import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
// Translate Module
import {TranslateService} from '@ngx-translate/core';
import {NotifyService} from '../../../../../service/notify.service';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import {GroupService} from '../../../../../service/group.service';
import {RoleService} from '../../../../../service/role.service';

@Component({
    selector: 'kt-group-user-add',
    templateUrl: './group-add.component.html',
    styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {

    formAdd: FormGroup;
    roles: any = [];
    isDuplicate = false;

    constructor(
        private dialogRef: MatDialogRef<GroupAddComponent>,
        private groupService: GroupService,
        private roleService: RoleService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.getAllRole();
    }

    initForm() {
        this.formAdd = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            code: ['', Validators.compose([Validators.required, Validators.maxLength(150), Validators.pattern('^[A-Za-z0-9_]+$')])],
            roles: this.fb.array([])
        });
    }

    getAllRole() {
        this.roleService.getAllRoleActive().subscribe(res => {
            if (res && res.status) {
                this.roles = res.data;
                const roles = <FormArray> this.formAdd.get('roles') as FormArray;
                this.roles.forEach(it => {
                    if (it.defaultRole && it.defaultRole == true) {
                        roles.push(new FormControl(it.id));
                        this.cdr.markForCheck();
                    }
                });
            }
        });
    }

    onChange(event) {
        const roles = <FormArray> this.formAdd.get('roles') as FormArray;
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
        if (!this.permissionService.canAccess(PERMISSION_CODE.GROUP.ADD)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        this.isDuplicate = false;
        if (!this.formAdd.valid) {
            this.formAdd.markAllAsTouched();
            return;
        }
        const body = {
            code: this.formAdd.controls.code.value.toString().trim(),
            name: this.formAdd.controls.name.value.toString().trim(),
            roleIds: this.formAdd.controls.roles.value,
        };
        try {
            this.groupService.create(body).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('GROUP.ADD.SUCCESS_MESSAGE'));
                        this.dialogRef.close(res);
                        return;
                    }
                    if (res.httpCode == 409) {
                        this.isDuplicate = true;
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('WARN', '', this.translate.instant('GROUP.ADD.ERROR_MESSAGE'));
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
        const roles = <FormArray> this.formAdd.get('roles') as FormArray;
        return roles.value.includes(role.id);
    }
}
