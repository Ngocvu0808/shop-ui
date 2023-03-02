import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../../../../service/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { CryptoService } from '../../../../../core/_common/helper/crypto.service';
import { UserService } from '../../../../../service/user.service';

@Component({
    selector: 'mar-user-change-password',
    templateUrl: './user-change-password.component.html',
    styleUrls: ['./user-change-password.component.scss']
})
export class UserChangePasswordComponent implements OnInit {
    editForm: FormGroup;
    newPass: string = '';
    reNewPass: string = '';

    constructor(
        private dialogRef: MatDialogRef<UserChangePasswordComponent>,
        private fb: FormBuilder,
        private userService: UserService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private cryptoService: CryptoService
    ) {

    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.editForm = this.fb.group({
            oldPass: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            newPass: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.minLength(8)])],
            reNewPass: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.minLength(8)])],
        });
    }

    save() {
        if (!this.editForm.valid) {
            this.editForm.markAllAsTouched();
            return;
        }

        const req = {
            password: this.cryptoService.encrypt(this.editForm.controls.oldPass.value.toString().trim()),
            new_pass: this.cryptoService.encrypt(this.editForm.controls.newPass.value.toString().trim()),
            new_pass_cf: this.cryptoService.encrypt(this.editForm.controls.reNewPass.value.toString().trim()),
        };
        try {
            this.userService.changePass(req).subscribe(res => {
                console.log('res', res);
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('USER.USER_MANAGE.CHANG_PASS_SUCCESS'));
                        this.dialogRef.close(res);
                        return;
                    }
                    if (res.httpCode == 400 && res.errorCode == '200051') {
                        this.notifyService.notify('WARN', '', this.translate.instant('USER.USER_MANAGE.PASS_INCORRECT'));
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ERROR'));
        }
    }

    getNewPass() {
        this.newPass = this.editForm.controls.newPass.value;
    }

    getReNewPass() {
        this.reNewPass = this.editForm.controls.reNewPass.value;
        if (this.newPass != this.reNewPass && this.reNewPass.length > 0 && this.newPass.length > 0) {
            this.editForm.controls.reNewPass.setErrors({ matchPass: true })
        } else {
            if (this.editForm.controls.reNewPass.errors) {
                delete this.editForm.controls.reNewPass.errors['matchPass'];
            }
        }
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.editForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    close() {
        this.dialogRef.close();
    }

}
