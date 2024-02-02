import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request, { axiosInstance } from "@/utilies/request";

export default class DispenserRepository extends Repository<any> {

    url = '/TL_Dispenser?$select=U_tl_type,Code,Name,U_tl_status,U_tl_bplid';

    // specific key
    key = 'tl_dispenser';

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

    async getCount(query?: any): Promise<number> {
        const { params } = query;
        return await axiosInstance
            .get(`${this.url}/$count`, { params })
            .then((res: any) => res?.data)
            .catch((e) => {
                throw new Error(e);
            });
    }
}
