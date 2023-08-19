import Repository from "@/astractions/repository";
import Manager from "@/models/Manager";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
export default class ManagerRepository extends Repository<Manager> {

  url = '/EmployeesInfo';

  key = 'EmployeesInfo';

  async get<Manager>(query?: string | undefined): Promise<Manager[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const manager = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(manager);
    }

    const manager = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(manager));
    localStorage.setItem(this.key, enc);

    return manager;
  }


  find<Manager>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const manager: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Manager(manager.find((e: any) => e?.EmployeeID === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Manager> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Manager> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Manager> {
    throw new Error("Method not implemented.");
  }
}