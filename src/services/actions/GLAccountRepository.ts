import Repository from "@/astractions/repository";
import GLAccount from "@/models/GLAccount";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class GLAccountRepository extends Repository<GLAccount> {
   
    url = '/ChartOfAccounts?$select=Code,Name';
    
    // specific key
    key = 'gl_accounts';

    async get<GLAccount>(query?: string | undefined): Promise<GLAccount[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const gLAccounts = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(gLAccounts);
        }

        const gLAccounts = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(gLAccounts));
        localStorage.setItem(this.key, enc);

        return gLAccounts;
    }


    find<GLAccount>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
     
        const gLAccounts: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return gLAccounts.find((e: any) => e?.Code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<GLAccount> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<GLAccount> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<GLAccount> {
        throw new Error("Method not implemented.");
    }
}