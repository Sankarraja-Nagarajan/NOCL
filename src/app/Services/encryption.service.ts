import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: "root",
})
export class EncryptionService {
  private key: string = "The secret key is Nocil Limited - Navy Mumbai";
  constructor() {}

  encrypt(data: string): string {
    const ciphertext = CryptoJS.AES.encrypt(data, this.key).toString();
    return ciphertext;
  }

  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}
