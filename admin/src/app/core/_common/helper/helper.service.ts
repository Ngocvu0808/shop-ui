import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(private datePipe: DatePipe) {
    }

    convertDatePickerToString(date) {
        if (date) {
            return this.datePipe.transform(new Date(date.year, date.month - 1, date.day), 'yyyyMMdd');
        } else {
            return 'undefined';
        }
    }

    convertTitleCase(input: string): string {
        if (!input) {
            return '';
        } else {
            return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
        }
    }
}
