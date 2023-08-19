import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import BusinessPartnerGroups from "@/models/BusinessPartnerGroups";

export default class BusinessPartnerGroupsRepository extends Repository<BusinessPartnerGroups> {
   
    url = '/BusinessPartnerGroups';
    
    // specific key
    key = 'BusinessPartnerGroups';

    async get<BusinessPartnerGroups>(query?: string | undefined): Promise<BusinessPartnerGroups[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const businessPartnerGroup = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(businessPartnerGroup);
        }

        const businessPartnerGroup = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(businessPartnerGroup));
        localStorage.setItem(this.key, enc);

        return businessPartnerGroup;
    }


    find<BusinessPartnerGroups>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const businessPartnerGroup: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return new BusinessPartnerGroups(businessPartnerGroup.find((e: any) => e?.Code === code) ?? {});
      }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<BusinessPartnerGroups> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<BusinessPartnerGroups> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<BusinessPartnerGroups> {
        throw new Error("Method not implemented.");
    }
}