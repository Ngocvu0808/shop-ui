import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {ServiceService} from '../../../../../service/service.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'mar-api-request-detail',
    templateUrl: './api-request-detail.component.html',
    styleUrls: ['./api-request-detail.component.scss']
})
export class ApiRequestDetailComponent implements OnInit {
    apiId: any;
    apiDetail: ApiDetail = new ApiDetail();

    constructor(
        private dialogRef: MatDialogRef<ApiRequestDetailComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private serviceService: ServiceService,
        private notifyService: NotifyService,
        private translate: TranslateService
    ) {
        this.apiId = data.element.id;
    }

    ngOnInit() {
        this.getApiRequestDetail();
    }

    getApiRequestDetail() {
        try {
            this.serviceService.getApiRequestById(this.apiId).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.apiDetail = res.data;
                        return;
                    } else {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('WARN', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
        }
    }

    approved() {
        this.updateStatus(this.apiId, 'APPROVED');
    }

    reject() {
        this.updateStatus(this.apiId, 'REJECTED');
    }

    close() {
        this.dialogRef.close();
    }

    updateStatus(id: any, status: any) {
        if (this.apiDetail.status != 'REQUESTING') {
            return;
        }

        const title = this.translate.instant('API_REQUEST.UPDATE_STATUS.TITLE');
        const message = status == 'REJECTED' 
            ? this.translate.instant('API_REQUEST.UPDATE_STATUS.CONFIRM_REJECT') + this.apiDetail.name 
            : this.translate.instant('API_REQUEST.UPDATE_STATUS.CONFIRM_APPROVE') + this.apiDetail.name;
        const yes = this.translate.instant('COMMON.BTN_CONFIRM');
        const no = this.translate.instant('COMMON.BTN_CANCEL');
        const dialogData = new ConfirmDialogModel(title, message, yes, no);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: '600px',
            data: dialogData
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                try {
                    const req = {
                        status: status
                    };
    
                    this.serviceService.updateApiRequest(id, req).subscribe(res => {
                        if (res && res.status) {
                            if (status == 'APPROVED') {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('API_REQUEST.UPDATE_STATUS.APPROVE_SUCCESS'));
                            } else if (status == 'REJECTED') {
                                this.notifyService.notify('SUCCESS', '', this.translate.instant('API_REQUEST.UPDATE_STATUS.REJECT_SUCCESS'));
                            }
                            this.dialogRef.close(res);
                            return;
                        }
                    });
                }

                catch (e){
                    console.log(e);
                    this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
                }
            }
        })
    }
}

class ApiDetail {
    id: number;
    name: string;
    code: string;
    api: string;
    method: string;
    system: any;
    service: any;
    client: any;
    type: string;
    status: string;
    purpose: string;
    username: string;
    createdTime: any;
}
