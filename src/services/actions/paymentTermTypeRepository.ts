import Repository from "@/astractions/repository";
import PaymentTermType from "@/models/PaymentTermType";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class PaymentTermTypeRepository extends Repository<PaymentTermType> {
   
    url = '/PaymentTermsTypes?$select=PaymentTermsGroupName,GroupNumber,GeneralDiscount';
    
    // specific key
    key = 'paymentTermTypes';

    async get<PaymentTermType>(query?: string | undefined): Promise<PaymentTermType[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const paymentTermTypes = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(paymentTermTypes);
        }

        const paymentTermTypes = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(paymentTermTypes));
        localStorage.setItem(this.key, enc);

        return paymentTermTypes;
    }


    find<PaymentTermType>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const paymentTermTypes: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return paymentTermTypes.find((e: any) => e?.GroupNumber == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<PaymentTermType> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<PaymentTermType> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<PaymentTermType> {
        throw new Error("Method not implemented.");
    }
}