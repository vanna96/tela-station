import Repository from "@/astractions/repository";
import Branch from "@/models/Branch";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class BranchRepository extends Repository<Branch> {
   
    url = '/Branches';
    
    // specific key
    key = 'branches';

    async get<Branch>(query?: string | undefined): Promise<Branch[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const branchs = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(branchs);
        }

        const branchs = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(branchs));
        localStorage.setItem(this.key, enc);

        return branchs;
    }


    find<Branch>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const branchs: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return branchs.find((e: any) => e?.Code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Branch> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Branch> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Branch> {
        throw new Error("Method not implemented.");
    }
}