import Repository from "@/astractions/repository";
import Status from "@/models/Status";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class StatusRepository extends Repository<Status> {

  url = '/EmployeeStatus';

  // specific key
  key = 'EmployeeStatus';

  async get<Status>(query?: string | undefined): Promise<Status[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const status = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(status);
    }

    const status = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(status));
    localStorage.setItem(this.key, enc);

    return status;
  }


  find<Status>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const status: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Status(status.find((e: any) => e?.StatusId === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Status> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Status> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Status> {
    throw new Error("Method not implemented.");
  }
}