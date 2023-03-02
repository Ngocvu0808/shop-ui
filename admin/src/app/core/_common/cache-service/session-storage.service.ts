export class SessionStorageService {

    public isExist(key: string): boolean {
        if (sessionStorage.getItem(key)) {
            return true;
        }
        return false;
    }

    public getItem(key: string) {
        if (this.isExist(key)) {
            const value = sessionStorage.getItem(key);
            return typeof value === 'string' ? value : JSON.parse(sessionStorage.getItem(key));
        }
        return null;
    }

    public setItem(key: string, value: any) {
        if (typeof value === 'string') {
            return sessionStorage.setItem(key, value);
        }
        return sessionStorage.setItem(key, JSON.stringify(value));
    }

    public removeItem(key: string) {
        return sessionStorage.removeItem(key);
    }

    public clearAll() {
        return sessionStorage.clear();
    }
}