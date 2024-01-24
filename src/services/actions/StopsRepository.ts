import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import Stops from "@/models/Stops";
export default class StopsRepository extends Repository<Stops> {
   
    url = '/TL_STOPS';
    
    // specific key
    key = 'stops';

    async get<Stops>(query?: string | undefined): Promise<Stops[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const stops = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(stops);
        }

        const stops = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(stops));
        localStorage.setItem(this.key, enc);

        return stops;
    }


    find<Stops>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const stops: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return stops.find((e: any) => e?.Code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Stops> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Stops> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Stops> {
        throw new Error("Method not implemented.");
    }
}