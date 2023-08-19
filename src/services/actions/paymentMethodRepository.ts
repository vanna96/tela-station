import Repository from "@/astractions/repository";
import PaymentMethod from "@/models/PaymentMethod";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class PaymentMethodRepository extends Repository<PaymentMethod> {
   
    url = '/WizardPaymentMethods?$select=Type, PaymentMethodCode,Description';
    
    // specific key
    key = 'paymentMethods';

    async get<PaymentMethod>(query?: string | undefined): Promise<PaymentMethod[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const paymentMethods = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(paymentMethods);
        }

        const paymentMethods = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(paymentMethods));
        localStorage.setItem(this.key, enc);

        return paymentMethods;
    }


    find<PaymentMethod>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const paymentMethods: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return paymentMethods.find((e: any) => e?.PaymentMethodCode == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<PaymentMethod> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<PaymentMethod> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<PaymentMethod> {
        throw new Error("Method not implemented.");
    }
}