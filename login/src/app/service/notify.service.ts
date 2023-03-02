'use strict';

import {Injectable} from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';



@Injectable({providedIn: 'root'})
export class NotifyService {

  constructor(private toast: ToastrManager) {
  }



  notify(status : string,title: string,body: string){
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
}
