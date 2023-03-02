'use strict';

import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({ providedIn: 'root' })
export class NotifyService {

    constructor(private toast: ToastrManager) {
    }

    notify(status: string, title: string, body: string) {
        switch (status) {
            case "SUCCESS":
                this.toast.successToastr(body, title);
                break;
            case "INFO":
                this.toast.infoToastr(body, title);
                break;
            case "ERROR":
                this.toast.errorToastr(body, title);
                break;
            case "WARN":
                this.toast.warningToastr(body, title);
                break;
        }
    }
    showError() {
        this.toast.customToastr('<button  style=\'color: #fff; font-size: 16px; text-align: center;width: 100%; height: 100%;position:absolute; top: 0;left: 0;right: 0; bottom:0; background: #E91F32;border: 0\'>Có lỗi xảy ra</button>', '', {enableHTML: true, showCloseButton: true, toastTimeout: 100000, dismiss: 'controlled'})
    }
}
