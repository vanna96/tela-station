import Repository from "@/astractions/repository";
import FactoringIndicator from "@/models/FactoringIndicator";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class FactoringIndicatorRepository extends Repository<FactoringIndicator> {
   
    url = '/FactoringIndicators';
    
    // specific key
    key = 'factoringIndicators';

    async get<FactoringIndicator>(query?: string | undefined): Promise<FactoringIndicator[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const factoringIndicators = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(factoringIndicators);
        }

        const factoringIndicators = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(factoringIndicators));
        localStorage.setItem(this.key, enc);

        return factoringIndicators;
    }


    find<FactoringIndicator>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        const factoringIndicators: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return factoringIndicators.find((e: any) => e?.IndicatorCode == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<FactoringIndicator> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<FactoringIndicator> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<FactoringIndicator> {
        throw new Error("Method not implemented.");
    }
}