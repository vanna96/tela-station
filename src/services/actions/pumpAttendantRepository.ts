import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class PumpAttendantRepository extends Repository<any> {

    url = '/TL_PUMP_ATTEND?$select=Code,U_tl_fname,U_tl_lname,U_tl_bplid';

    // specific key
    key = 'tl_pump_attendant';

    async get(query?: string): Promise<any[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const salePersons = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(salePersons);
        }

        const salePersons = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(salePersons));
        localStorage.setItem(this.key, enc);

        return salePersons;
    }

    find(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};

        const salePersons: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '{}')));
        return salePersons.find((e: any) => e?.code == code);
    }

    post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    patch(id: any, payload: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
