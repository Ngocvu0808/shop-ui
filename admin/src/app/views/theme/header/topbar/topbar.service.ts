import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUrl, ServerResponse } from 'system-navigator/lib/models';
import { ApiHelperService } from '../../../../core/_common/apiHelper.service';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TopbarService {
    imageToShow: string | ArrayBuffer;

    constructor(
        private api: ApiHelperService,
    ) { }

    getUrls(api, req): Observable<AppUrl[]> {
        const url = environment[api];
        return this.api.getAll(url, req).pipe(map((res: ServerResponse) => {
            res.data.map((appUrl: AppUrl) => {
                this.createImageFromBlob(appUrl.urlLogo);
                appUrl.urlLogo = this.imageToShow;
                return appUrl;
            });
            return res.data;
        }));
    }

    private createImageFromBlob(image: Blob | string): void {
        if (!image) {
            this.imageToShow = undefined;
            return;
        }

        if (typeof image === 'string') {
            this.imageToShow = image;
            return;
        }

        let reader = new FileReader();
        reader.addEventListener(
            'load',
            () => {
                this.imageToShow = reader.result;
            },
            false
        );

        reader.readAsDataURL(image);
    }
}