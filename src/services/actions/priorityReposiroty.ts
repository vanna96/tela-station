import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import Priority from "@/models/Priority";
export default class PriorityRepository extends Repository<Priority> {

  url = '/BPPriorities';

  // specific key
  key = 'BPPriorities';

  async get<Priority>(query?: string | undefined): Promise<Priority[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const priority = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(priority);
    }

    const priority = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(priority));
    localStorage.setItem(this.key, enc);

    return priority;
  }


  find<Priority>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const priority: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Priority(priority.find((e: any) => e?.Priority === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Priority> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Priority> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Priority> {
    throw new Error("Method not implemented.");
  }
}