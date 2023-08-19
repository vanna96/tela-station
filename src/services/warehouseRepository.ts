import Repository from "@/astractions/repository";
import Warehouse from "@/models/Warehouse";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class WarehouseRepository extends Repository<Warehouse> {
   
    url = '/Warehouses?$select=WarehouseCode,WarehouseName';
    
    // specific key
    key = 'warehouse';

    async get<Warehouse>(query?: string | undefined): Promise<Warehouse[]> {
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


    find<Warehouse>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const warehouse: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return warehouse.find((e: any) => e?.WarehouseCode == code);
    }


    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Warehouse> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Warehouse> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Warehouse> {
        throw new Error("Method not implemented.");
    }
}