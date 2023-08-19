import Repository from "@/astractions/repository";
import DistributionRule from "@/models/DistributionRule";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class DistributionRuleRepository extends Repository<DistributionRule> {
   
    url = `/DistributionRules?$select=FactorCode,FactorDescription,InWhichDimension&$filter=Active eq 'tYES'`;
    
    // specific key
    key = 'distributionRules';

    async get<DistributionRule>(query?: string | undefined): Promise<DistributionRule[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const distributionRules = JSON.parse(Encryption.decrypt(this.key, data));
            // console.log(distributionRules)
            return JSON.parse(distributionRules);
        }

        const distributionRules = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(distributionRules));
        localStorage.setItem(this.key, enc);

        return distributionRules;
    }


    find<DistributionRule>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        const distributionRules: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return distributionRules.find((e: any) => e?.FactorCode == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<DistributionRule> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<DistributionRule> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<DistributionRule> {
        throw new Error("Method not implemented.");
    }
}