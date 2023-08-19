import { AES, enc } from 'crypto-js';

export default class Encryption {

    constructor() {}


    public static encrypt(secret: string, value : any) {
        const cipherText = AES.encrypt(JSON.stringify(value), secret);
        return cipherText.toString();
    }


    public static decrypt(secret: string, value: string) {
        let bytes = AES.decrypt(value, secret);
       return bytes.toString(enc.Utf8);
    }
}