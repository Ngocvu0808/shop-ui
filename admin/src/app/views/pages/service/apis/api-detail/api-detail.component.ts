import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {ServiceService} from '../../../../../service/service.service';

@Component({
    selector: 'mar-api-detail',
    templateUrl: './api-detail.component.html',
    styleUrls: ['./api-detail.component.scss']
})
export class ApiDetailComponent implements OnInit {
    apiId: any;
    apiDetail: any = {};

    constructor(
        private dialogRef: MatDialogRef<ApiDetailComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private serviceService: ServiceService,
        private notifyService: NotifyService,
        private translate: TranslateService
    ) {
        this.apiId = data.element.id;
    }

    ngOnInit() {
        this.getApiDetail();
    }

    getApiDetail() {
        try {
            this.serviceService.getApiById(this.apiId).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.apiDetail = res.data;
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
        }
    }

    close() {
        this.dialogRef.close();
    }
}
