import Repository from "@/astractions/repository";
import VatGroup from "@/models/VatGroup";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class VatGroupRepository extends Repository<VatGroup> {
   
    url = '/VatGroups?$select=Code, Name, Category,VatGroups_Lines';
    
    // specific key
    key = 'vatGroup';

    async get<VatGroup>(query?: string | undefined): Promise<VatGroup[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const vatGroups = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(vatGroups);
        }

        const vatGroups = await request('GET', this.url).then((res: any) => res?.data?.value?.map((e : any) => new VatGroup(e)));
        const enc = Encryption.encrypt(this.key, JSON.stringify(vatGroups));
        localStorage.setItem(this.key, enc);


        return vatGroups;
    }


    find<VatGroup>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
     
        const vatGroups: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '{}')));
        return vatGroups.find((e: any) => e?.code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<VatGroup> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<VatGroup> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<VatGroup> {
        throw new Error("Method not implemented.");
    }
}