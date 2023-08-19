import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import Industry from "@/models/Industry";
import request from "@/utilies/request";

export default class IndustryRepository extends Repository<Industry> {

  url = '/Industries';

  // specific key
  key = 'Industries';

  async get<Industry>(query?: string | undefined): Promise<Industry[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const industry = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(industry);
    }

    const industry = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(industry));
    localStorage.setItem(this.key, enc);

    return industry;
  }


  find<Industry>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const industry: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Industry(industry.find((e: any) => e?.IndustryCode === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Industry> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Industry> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Industry> {
    throw new Error("Method not implemented.");
  }
}