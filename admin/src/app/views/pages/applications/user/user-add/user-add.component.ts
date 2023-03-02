import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {NotifyService} from '../../../../../service/notify.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../../../../service/application.service';
import {RoleService} from '../../../../../service/role.service';
import {GroupService} from '../../../../../service/group.service';
import { NzOptionComponent } from 'ng-zorro-antd';

@Component({
    selector: 'mar-user-add',
    templateUrl: './user-add.component.html',
    styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
    formAdd: FormGroup;
    roleList: any = [];
    roles: any;
    isValidUser = false;
    isValidRole = false;
    validEmailMsg = '';
    userListForFilter: Array<any>;
    userList: Array<any>;
    data: any;
    appId: any;
    loading: boolean = false;

    constructor(
        private appService: ApplicationService,
        private roleService: RoleService,
        private groupService: GroupService,
        private dialogRef: MatDialogRef<UserAddComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private notifyService: NotifyService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef) {
        this.data = data;
    }

    ngOnInit() {
        this.appId = this.data.appId;
        this.initForm();
        this.getAllRoles();
        this.getListUser();    
    }

    initForm() {
        this.formAdd = this.fb.group({
            userId: ['', Validators.compose([Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100),
                Validators.pattern('^[A-Za-z0-9_.+-@%]+$')])],
            roles: this.fb.array([])
        });
    }

    getAllRoles() {
        this.roleService.getAllRoleByObjectCode('APPLICATION').subscribe(res => {
            if (res && res.status) {
                this.roleList = res.data;               
                const roles = <FormArray> this.formAdd.get('roles') as FormArray;
                this.roleList.forEach(it => {
                    if (it.defaultRole && it.defaultRole == true) {
                        roles.push(new FormControl(it.id));
                    }
                });
            }
        });
    }

    getListUser() {
        this.groupService.getAllUserAndGroup('').subscribe(res => {
            if (res && res.status) {
                const users: Array<any> = res.data.filter(item => {
                    return item.type == 'USER' && !this.data.listUserId.includes(item.id);
                });
                this.userList = users;
                this.userListForFilter = users;
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
        const payload = {
            user_id: this.formAdd.controls.userId.value.id,
            role_ids: this.formAdd.controls.roles.value
        };
        if (payload.user_id == '') {
            this.isValidUser = true;
            return;
        }
        if (payload.role_ids.length == 0) {
            this.isValidRole = true;
            return;
        }
        this.loading = true;
        try {
            this.appService.addUser(this.appId, payload).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('USER.ADD.SAVE_SUCCESS_MSG'));
                        this.dialogRef.close(res);
                        this.loading = false;
                        return;
                    } else {
                        if (res.httpCode != 403) {
                            this.notifyService.notify('ERROR', '', this.translate.instant('USER.ADD.ERROR_MSG'));
                            this.loading = false;
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('USER.ADD.ERROR_MSG'));
            this.loading = false;
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
    
    onSearch(input?: string, option?: NzOptionComponent) {
        // console.log(input, option);
        const toPlainString = (str) => {
            // to plain
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
            str = str.replace(/đ/g, 'd');
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
            str = str.replace(/Đ/g, 'D');
            // Some system encode vietnamese combining accent as individual utf-8 characters
            // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
            str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
            // Remove extra spaces
            // Bỏ các khoảng trắng liền nhau
            str = str.replace(/ + /g, ' ');
            str = str.trim();
            // Remove punctuations
            // Bỏ dấu câu, kí tự đặc biệt
            str = str.replace(
                /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
                ' '
            );
            str = str.replace(/\s/g, '');
            str = str.toLowerCase();
            return str;
        };

        const searchValue: string = toPlainString(input);

        return toPlainString(option.nzValue.name).includes(searchValue) 
            || toPlainString(option.nzValue.username).includes(searchValue) 
            || toPlainString(option.nzValue.email).includes(searchValue)
    }
}
