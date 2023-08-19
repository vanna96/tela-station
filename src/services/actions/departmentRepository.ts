import Repository from "@/astractions/repository";
import Department from "@/models/Department";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class DepartmentRepository extends Repository<Department> {
   
    url = '/Departments';
    
    // specific key
    key = 'departments';

    async get<Department>(query?: string | undefined): Promise<Department[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const departments = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(departments);
        }

        const departments = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(departments));
        localStorage.setItem(this.key, enc);

        return departments;
    }


    find<Department>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const departments: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return departments.find((e: any) => e?.Code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Department> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Department> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Department> {
        throw new Error("Method not implemented.");
    }
}