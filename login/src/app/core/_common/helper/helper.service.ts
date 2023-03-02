import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(private datePipe: DatePipe) {
    }

    convertDatePickerToString(date, format: string) {
        if (date) {
            return this.datePipe.transform(new Date(date.year, date.month - 1, date.day), format);
        } else {
            return 'undefined';
        }
    }

    generateUrl(host, params: any): string {
        const keys: Array<any> = Object.keys(params);
        let url: string = host;
        if (keys.length > 0) {
            url = url.concat('?');
            keys.forEach(it => {
                url = url.concat(`${it}=${params[it]}&`);
            });
            url = url.substring(0, url.length - 1);
        }
        return url;
    }
}
