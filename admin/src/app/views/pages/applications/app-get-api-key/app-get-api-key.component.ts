import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {NotifyService} from '../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {LayoutUtilsService, MessageType} from '../../../../core/_base/crud';
import {UserService} from '../../../../service/user.service';

@Component({
    selector: 'mar-app-get-api-key',
    templateUrl: './app-get-api-key.component.html',
    styleUrls: ['./app-get-api-key.component.scss']
})
export class AppGetApiKeyComponent implements OnInit {
    data: any = {};
    apiKey: any = '';

    constructor(
        private dialogRef: MatDialogRef<AppGetApiKeyComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private userService: UserService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private layoutUtilsService: LayoutUtilsService,
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.apiKey = this.data.apiKey;
        // this.getApiKey();
    }

    getApiKey() {
        this.userService.generateApiKey().subscribe(res => {
            if (res) {
                if (res.status) {
                    this.apiKey = res.data;
                }
            }
        });
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

    close() {
        this.dialogRef.close();
    }

}
