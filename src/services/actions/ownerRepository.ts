import Repository from "@/astractions/repository";
import Owner from "@/models/Owner";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class OwnerRepository extends Repository<Owner> {

    url = '/EmployeesInfo?$filter=ApplicationUserID ne null&$select=EmployeeID,FirstName,LastName';

    // specific key
    key = 'employeesInfo';

    async get<Owner>(query?: string | undefined): Promise<Owner[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const owners = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(owners)?.map((e: any) => new Owner(e).toJson());
        }

        const owners = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(owners));
        localStorage.setItem(this.key, enc);

        return owners?.map((e: any) => new Owner(e).toJson());
    }


    find<Owner>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const owners: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return new Owner(owners.find((e: any) => e?.EmployeeID === code) ?? {});
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Owner> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Owner> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Owner> {
        throw new Error("Method not implemented.");
    }
}