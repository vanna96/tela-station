import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import ExpDic from "@/models/ExpDic";
export default class ExpdicRepository extends Repository<ExpDic> {
   
    url = '/TL_ExpDic?$select=Code, Name';
    
    // specific key
    key = 'ExpDic';

    async get<ExpDic>(query?: string | undefined): Promise<ExpDic[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const expdic = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(expdic);
        }

        const expdic = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(expdic));
        localStorage.setItem(this.key, enc);

        return expdic;
    }


    find<ExpDic>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const expdic: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return expdic.find((e: any) => e?.Code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<ExpDic> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<ExpDic> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<ExpDic> {
        throw new Error("Method not implemented.");
    }
}