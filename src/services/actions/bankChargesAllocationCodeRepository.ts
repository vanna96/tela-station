import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import BankChargesAllocationCodes from "@/models/BankChargesAllocationCode";

export default class BankChargesAllocationCodeRepository extends Repository<BankChargesAllocationCodes> {
   
    url = '/BankChargesAllocationCodes';
    
    // specific key
    key = 'BankChargesAllocationCodes';

    async get<BankChargesAllocationCodes>(query?: string | undefined): Promise<BankChargesAllocationCodes[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const bankChargesAllocationCodes = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(bankChargesAllocationCodes);
        }

        const bankChargesAllocationCodes = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(bankChargesAllocationCodes));
        localStorage.setItem(this.key, enc);

        return bankChargesAllocationCodes;
    }


    find<BankChargesAllocationCodes>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const bankChargesAllocationCodes: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return new BankChargesAllocationCodes(bankChargesAllocationCodes.find((e: any) => e?.Code === code) ?? {});
      }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<BankChargesAllocationCodes> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<BankChargesAllocationCodes> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<BankChargesAllocationCodes> {
        throw new Error("Method not implemented.");
    }
}