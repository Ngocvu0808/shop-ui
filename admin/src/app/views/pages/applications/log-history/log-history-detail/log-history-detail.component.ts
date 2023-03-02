import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotifyService } from '../../../../../service/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../../../service/application.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

@Component({
    selector: 'mar-log-history-detail',
    templateUrl: './log-history-detail.component.html',
    styleUrls: ['./log-history-detail.component.scss'],
})
export class LogHistoryDetailComponent implements OnInit {
    logId: any;
    appId: any;
    data: any;
    logsHistoryDetail: any;

    constructor(
        private dialogRef: MatDialogRef<LogHistoryDetailComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private appService: ApplicationService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
    ) {
        this.logId = data.element.id;
        this.appId = data.element.appId;
        this.data = data.element;
        this.dialogRef.disableClose = false;
    }

    ngOnInit() {
        this.getLogsHistoryDetail();
    }

    getLogsHistoryDetail() {
        try {
            this.appService.getLogById(this.appId, this.logId).subscribe((res) => {
                if (res) {
                    if (res.status) {
                        this.logsHistoryDetail = res.data;
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

    close() {
        this.dialogRef.close();
    }

    copyMessage(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.layoutUtilsService.showActionNotification('Copied to clipboard', MessageType.Delete, 3000, true, false);
    }
}
