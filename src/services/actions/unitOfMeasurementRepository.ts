import Repository from "@/astractions/repository";
import UnitOfMeasurement from "@/models/UnitOfMeasurement";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class UnitOfMeasurementRepository extends Repository<UnitOfMeasurement> {

    url = '/UnitOfMeasurements?$select=AbsEntry,Code,Name';

    // specific key
    key = 'UnitOfMeasurements';

    async get<UnitOfMeasurement>(query?: string | undefined): Promise<UnitOfMeasurement[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const unitOfMeasurements = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(unitOfMeasurements);
        }

        const unitOfMeasurements = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(unitOfMeasurements));
        localStorage.setItem(this.key, enc);

        return unitOfMeasurements;
    }

    find<UnitOfMeasurement>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const unitOfMeasurements: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return unitOfMeasurements.find((e: any) => e?.AbsEntry == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<UnitOfMeasurement> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<UnitOfMeasurement> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<UnitOfMeasurement> {
        throw new Error("Method not implemented.");
    }
}