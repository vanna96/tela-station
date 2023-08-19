import Repository from "@/astractions/repository";
import ShippingType from "@/models/ShippingType";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class ShippingTypeRepository extends Repository<ShippingType> {
   
    url = '/ShippingTypes';
    
    // specific key
    key = 'shipping_types';

    async get<ShippingType>(query?: string | undefined): Promise<ShippingType[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const shippingTypes = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(shippingTypes);
        }

        const shippingTypes = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(shippingTypes));
        localStorage.setItem(this.key, enc);

        return shippingTypes;
    }


    find<ShippingType>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
     
        const shippingTypes: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return shippingTypes.find((e: any) => e?.Code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<ShippingType> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<ShippingType> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<ShippingType> {
        throw new Error("Method not implemented.");
    }
}