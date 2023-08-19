import Repository from "@/astractions/repository";
import CustomsGroup from "@/models/CustomsGroup";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class CustomsGroupRepository extends Repository<CustomsGroup> {
   
    url = '/CustomsGroups?$select=Name,Code';
    
    // specific key
    key = 'custom-group';

    async get<CustomsGroup>(query?: string | undefined): Promise<CustomsGroup[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const customsgroup = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(customsgroup);
        }

        const customsgroup = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(customsgroup));
        localStorage.setItem(this.key, enc);

        return customsgroup;
    }


    find<CustomsGroup>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const customsgroup: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return customsgroup.find((e: any) => e?.Code == code);
    }
    
    // find<Owner>(code: number | undefined | null): any {
    //     const data = localStorage.getItem(this.key);
    //     if (!data) return {};
    //     const owners: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    //     return new customsgroup(owners.find((e: any) => e?.Code === code) ?? {});
    // }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<CustomsGroup> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<CustomsGroup> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<CustomsGroup> {
        throw new Error("Method not implemented.");
    }
}