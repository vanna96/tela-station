import Repository from "@/astractions/repository";
import Buyers from "@/models/Buyer";
import City from "@/models/City";
import FactoringIndicator from "@/models/FactoringIndicator";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class CityRepository extends Repository<City> {

  url = '/States?$select=Name, Code,Country&$orderby=Name asc';

  // specific key
  key = 'city';

  async get<City>(query?: string | undefined): Promise<City[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const citys = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(citys);
    }

    const citys = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(citys));
    localStorage.setItem(this.key, enc);

    return citys;
  }


  find<City>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const citys: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return citys.find((e: any) => e?.Code == code);
  }


  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<City> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<City> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<City> {
    throw new Error("Method not implemented.");
  }
}