import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../../../../service/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { ServiceService } from '../../../../../service/service.service';
import * as deepEqual from 'deep-equal';

@Component({
    selector: 'mar-service-add',
    templateUrl: './service-add.component.html',
    styleUrls: ['./service-add.component.scss']
})
export class ServiceAddComponent implements OnInit {
    addForm: FormGroup;
    listTagOptions: Array<any> = [];
    tags = [];
    systems: Array<any> = [];
    loading: boolean = false;
    dataInit: any;
    isValueChange: boolean = false;
    tagInit: any;

    constructor(
        private dialogRef: MatDialogRef<ServiceAddComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private serviceService: ServiceService,
        private notifyService: NotifyService,
        private cdr: ChangeDetectorRef,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.getSystems();
        this.getTags();
    }

    initForm() {
        this.addForm = this.fb.group({
            code: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z0-9_]+$')])],
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            system: ['', Validators.compose([Validators.maxLength(255)])],
            desc: ['', Validators.compose([Validators.maxLength(1000)])],
            tag: ['']
        });
    }

    getTags() {
        this.serviceService.getAllTag().subscribe(res => {
            if (res && res.status) {
                this.listTagOptions = res.data;
            }
        });
    }

    getSystems() {
        this.serviceService.getSystems().subscribe(res => {
            if (res && res.status) {
                this.systems = res.data;
            }
        });
    }

    save() {
        if (!this.addForm.valid) {
            this.addForm.markAllAsTouched();
            return;
        }
        const tagIdFilterList = this.listTagOptions.map(it => it.id);
        const tagIds: Array<any> = this.tags.filter(it => tagIdFilterList.includes(it));
        const listTagName: Array<any> = this.tags.filter(it => !tagIdFilterList.includes(it));
        const req = {
            name: this.addForm.controls.name.value,
            code: this.addForm.controls.code.value,
            description: this.addForm.controls.desc.value,
            systemId: this.addForm.controls.system.value,
            listTagName: listTagName,
            tagIds: tagIds

        };
        this.loading = true;
        try {
            this.serviceService.createService(req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ADD'));
                        this.dialogRef.close(res);
                        this.loading = false;
                        return;
                    }
                    if (res.httpCode == 409) {
                        if (res.errorCode == '210077') {
                            this.addForm.controls.code.setErrors({ duplidate: true });
                            this.loading = false;
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
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ERROR'));
            this.loading = false;
        }
    }

    onChangeData() {
        const controls = this.addForm.controls.code;
        if (controls.errors && controls.errors.duplidate) {
            controls.setErrors(null);
        }
        this.cdr.markForCheck();
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.addForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    close() {
        this.dialogRef.close();
    }


}
