import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';


const CRYPTO_KEY = '6$1#8@0$^@19zWTF';


@Injectable({providedIn: 'root'})
export class EncryptionService {

  encrypt(value: string): string {
    const encryptedPassword = CryptoJS.enc.Utf8.parse(value);
    return CryptoJS.AES.encrypt(encryptedPassword, this.parseCryptoKey(), this.getConfig())
        .toString();
  }

  decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, this.parseCryptoKey(), this.getConfig())
        .toString(CryptoJS.enc.Utf8);
  }

  private parseCryptoKey(): any {
    return CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
  }

  private getConfig(): any {
    return {
      keySize: 128 / 8,
      iv: this.parseCryptoKey(),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
  }
}
