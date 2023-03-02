import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifyService} from '../../../../../service/notify.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PERMISSION_CODE} from '../../../../../core/_common/config/permissionCode';
import * as deepEqual from 'deep-equal';
import {ServiceService} from '../../../../../service/service.service';

@Component({
    selector: 'mar-service-edit',
    templateUrl: './service-edit.component.html',
    styleUrls: ['./service-edit.component.scss']
})
export class ServiceEditComponent implements OnInit {

    editForm: FormGroup;
    data: any;
    listTagOptions: Array<{ id: number; tag: string }> = [];
    tags = [];
    systems: Array<any> = [];
    isValueChange: boolean = false;
    dataInit: any;
    tagInit: any;
    loading: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<ServiceEditComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private serviceService: ServiceService,
        private fb: FormBuilder,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private permissionService: PermissionService,
        private cdr: ChangeDetectorRef
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.initForm();
        this.getTags();
        this.getSystems();
    }

    initForm() {
        this.editForm = this.fb.group({
            id: [this.data.element.id, Validators.required],
            name: [this.data.element.name, Validators.compose([Validators.required, Validators.maxLength(255)])],
            code: [this.data.element.code, Validators.compose([Validators.required, Validators.maxLength(255)])],
            system: [this.data.element.systemId, Validators.compose([Validators.maxLength(255)])],
            desc: [this.data.element.description, Validators.compose([Validators.maxLength(2000)])],
        });
        this.tags = this.data.element.tags;
        this.dataInit = this.editForm.getRawValue();
        this.tagInit = this.tags;
    }

    getTags() {
        this.serviceService.getAllTag().subscribe(res => {
            if (res && res.status) {
                this.listTagOptions = res.data;
                const tagPivot = {};
                this.listTagOptions.forEach(it => {
                    tagPivot[it.tag] = it.id;
                });
                this.tags = this.tags.map(it => tagPivot[it]);
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

    edit() {
        if (!this.permissionService.canAccess(PERMISSION_CODE.SERVICE.SERVICE_UPDATE)) {
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.FORBIDDEN'));
            return;
        }
        if (!this.editForm.valid) {
            this.editForm.markAllAsTouched();
            return;
        }
        const id = this.editForm.controls.id.value;
        const tagIdFilterList = this.listTagOptions.map(it => it.id);
        const tagIds: Array<any> = this.tags.filter(it => tagIdFilterList.includes(it));
        const listTagName: Array<any> = this.tags.filter(it => !tagIdFilterList.includes(it));
        const data = {
            code: this.editForm.controls.code.value,
            name: this.editForm.controls.name.value,
            description: this.editForm.controls.desc.value,
            systemId: this.editForm.controls.system.value,
            listTagName: listTagName,
            tagIds: tagIds
        };
        this.loading = true;
        try {
            this.serviceService.updateService(id, data).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('SERVICE.EDIT.SUCCESS_MESSAGE'));
                        this.dialogRef.close(res);
                        this.loading = false;
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                        this.loading = false;
                    }
                }
            });
        } catch (e) {
            this.notifyService.notify('ERROR', '', this.translate.instant('SERVICE.EDIT.ERROR_MESSAGE'));
            this.loading = false;
        }
    }

    validateForm(controlName: string, validationType: string): boolean {
        const control = this.editForm.controls[controlName];
        if (!control) {
            return false;
        }
        return control.hasError(validationType) && (control.dirty || control.touched);
    }

    cancel() {
        this.dialogRef.close();
    }


    onChangeData() {
        const formValue = this.editForm.getRawValue();
        this.isValueChange = !deepEqual(this.tags, this.tagInit) || (!deepEqual(formValue, this.dataInit) && this.editForm.dirty && this.editForm.valid);
        this.cdr.markForCheck();
    }
}
