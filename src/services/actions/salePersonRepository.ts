import Repository from "@/astractions/repository";
import SalePerson from "@/models/SalePerson";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class SalePersonRepository extends Repository<SalePerson> {
   
    url = '/SalesPersons?$select=SalesEmployeeCode, SalesEmployeeName&$orderby=SalesEmployeeCode asc';
    
    // specific key
    key = 'sale_persons';

    async get<SalePerson>(query?: string | undefined): Promise<SalePerson[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const salePersons = JSON.parse(Encryption.decrypt(this.key, data));
            console.log(salePersons);
            
            return JSON.parse(salePersons);
        }

        const salePersons = await request('GET', this.url).then((res: any) => res?.data?.value?.map((e : any) => new SalePerson(e)));
        const enc = Encryption.encrypt(this.key, JSON.stringify(salePersons));
        localStorage.setItem(this.key, enc);


        return salePersons;
    }


    find<SalePerson>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
     
        const salePersons: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '{}')));
        return salePersons.find((e: any) => e?.code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<SalePerson> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<SalePerson> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<SalePerson> {
        throw new Error("Method not implemented.");
    }
}