import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocalStorageService {

    public isExist(key: string): boolean {
        if (localStorage.getItem(key)) {
            return true;
        }
        return false;
    }

    public getItem(key: string) {
        if (this.isExist(key)) {
            const value = localStorage.getItem(key);
            return typeof value === 'string' ? value : JSON.parse(localStorage.getItem(key));
        }
        return null;
    }

    public setItem(key: string, value: any) {
        if (typeof value === 'string') {
            return localStorage.setItem(key, value);
        }
        return localStorage.setItem(key, JSON.stringify(value));
    }

    public removeItem(key: string) {
        return localStorage.removeItem(key);
    }

    public clearAll() {
        return localStorage.clear();
    }
}
