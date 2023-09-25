import Repository from "@/astractions/repository";
import WareBinLocation from "@/models/WareBinLocation";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class WareBinLocationRepository extends Repository<WareBinLocation> {
    static get() {
        throw new Error("Method not implemented.");
    }

    url = '/sml.svc/BIZ_GET_BIN_QUERY';

    // specific key
    key = 'WareBinLocation';

    async get<WareBinLocation>(query?: string | undefined): Promise<WareBinLocation[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const warehouse = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(warehouse);
        }

        const warehouse = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(warehouse));
        localStorage.setItem(this.key, enc);
        return warehouse;
    }


    find<WareBinLocation>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const warehouse: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return warehouse.find((e: any) => e?.BinAbsEntry == code);
    }


    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<WareBinLocation> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<WareBinLocation> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<WareBinLocation> {
        throw new Error("Method not implemented.");
    }
}