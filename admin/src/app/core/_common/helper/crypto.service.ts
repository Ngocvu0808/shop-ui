import {Injectable} from '@angular/core';
import * as JsEncryptModule from 'jsencrypt';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CryptoService {
    private readonly crypto: any;
    private readonly publicKey: any;
    private readonly privateKey: any;

    constructor() {
        this.crypto = new JsEncryptModule.JSEncrypt();
        this.publicKey = environment.PUBLIC_KEY;
        this.privateKey = environment.PRIVATE_KEY;
    }

    /**
     * RSA 1024 encrypt
     * @param input
     */
    encrypt(input: string): string {
        this.crypto.setPublicKey(this.publicKey);
        return this.crypto.encrypt(input, this.publicKey);
    }

    /**
     * RSA decrypt 1024
     * @param input
     */
    decrypt(input: string): string {
        this.crypto.setPrivateKey(this.privateKey);
        return this.crypto.decrypt(input, this.privateKey);
    }


}
