import Repository from "@/astractions/repository";
import Manufacturer from "@/models/Manufacturer";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class ManufacturerRepository extends Repository<Manufacturer> {
   
    url = '/Manufacturers';
    
    // specific key
    key = 'manufacturers';

    async get<Manufacturer>(query?: string | undefined): Promise<Manufacturer[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const manufacturer = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(manufacturer);
        }

        const manufacturer = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(manufacturer));
        localStorage.setItem(this.key, enc);

        return manufacturer;
    }


    find<Manufacturer>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const manufacturer: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return manufacturer.find((e: any) => e?.Code == code);
    }
    
    // find<Owner>(code: number | undefined | null): any {
    //     const data = localStorage.getItem(this.key);
    //     if (!data) return {};
    //     const owners: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    //     return new Manufacturer(owners.find((e: any) => e?.Code === code) ?? {});
    // }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Manufacturer> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Manufacturer> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Manufacturer> {
        throw new Error("Method not implemented.");
    }
}