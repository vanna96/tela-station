import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import Holidays from "@/models/Holidays";
export default class HolidayRepository extends Repository<Holidays> {

  url = '/Holidays';

  // specific key
  key = 'Holidays';

  async get<Holidays>(query?: string | undefined): Promise<Holidays[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const holiday = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(holiday);
    }

    const holiday = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(holiday));
    localStorage.setItem(this.key, enc);

    return holiday;
  }


  find<Holidays>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const holiday: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Holidays(holiday.find((e: any) => e?.HolidayCode === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Holidays> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Holidays> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Holidays> {
    throw new Error("Method not implemented.");
  }
}