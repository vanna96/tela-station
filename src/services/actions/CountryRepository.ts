import Repository from "@/astractions/repository";
import Country from "@/models/Country";
import FactoringIndicator from "@/models/FactoringIndicator";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class CountryRepository extends Repository<Country> {

  url = '/Countries';

  // specific key
  key = 'countries';

  async get<Country>(query?: string | undefined): Promise<Country[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const country = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(country);
    }

    const country = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(country));
    localStorage.setItem(this.key, enc);

    return country;
  }




  find<Country>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const country: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return country.find((e: any) => e?.Code == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Country> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Country> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Country> {
    throw new Error("Method not implemented.");
  }
}