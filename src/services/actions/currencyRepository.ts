import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import Currency from "@/models/Currency";
import request from "@/utilies/request";

export default class CurrencyRepository extends Repository<Currency> {
   
    url = '/Currencies';
    
    // specific key
    key = 'Currencies';

    async get<Currency>(query?: string | undefined): Promise<Currency[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const currency = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(currency);
        }

        const currency = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(currency));
        localStorage.setItem(this.key, enc);

        return currency;
    }


    find<Currency>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const currency: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return new Currency(currency.find((e: any) => e?.Code === code) ?? {});
      }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Currency> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Currency> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Currency> {
        throw new Error("Method not implemented.");
    }
}