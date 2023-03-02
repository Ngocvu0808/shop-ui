import {MatPaginatorIntl} from '@angular/material/paginator';
import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    constructor(private readonly translate: TranslateService) {
        super();
        this.getAndInitTranslations();
        this.translate.onLangChange.subscribe((e: Event) => {
            this.getAndInitTranslations();
        });
    }

    getAndInitTranslations() {
        this.translate.get(['PAGINATOR.ITEMS_PER_PAGE_LABEL', 'PAGINATOR.NEXT_PAGE_LABEL', 'PAGINATOR.PREVIOUS_PAGE_LABEL',
            'PAGINATOR.FIRST_PAGE_LABEL', 'PAGINATOR.LAST_PAGE_LABEL', 'PAGINATOR.OF_LABEL']).subscribe(translation => {
            this.itemsPerPageLabel = translation['PAGINATOR.ITEMS_PER_PAGE_LABEL'];
            this.nextPageLabel = translation['PAGINATOR.NEXT_PAGE_LABEL'];
            this.previousPageLabel = translation['PAGINATOR.PREVIOUS_PAGE_LABEL'];
            this.firstPageLabel = translation['PAGINATOR.FIRST_PAGE_LABEL'];
            this.lastPageLabel = translation['PAGINATOR.LAST_PAGE_LABEL'];
            this.changes.next();
        });
    }


    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length == 0 || pageSize == 0) {
            return `0 ` + this.translate.instant('PAGINATOR.OF_LABEL') + ` ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} – ${endIndex} ` + this.translate.instant('PAGINATOR.OF_LABEL') + ` ${length}`;
    };
}
