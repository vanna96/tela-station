import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import Bank from "@/models/bank";
import request from "@/utilies/request";

export default class BankRepository extends Repository<Bank> {
   
    url = '/Banks';
    
    // specific key
    key = 'Banks';

    async get<Bank>(query?: string | undefined): Promise<Bank[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const bank = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(bank);
        }

        const bank = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(bank));
        localStorage.setItem(this.key, enc);

        return bank;
    }


    find<Bank>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const bank: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return bank.find((e: any) => e?.BankCode == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Bank> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Bank> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Bank> {
        throw new Error("Method not implemented.");
    }
}