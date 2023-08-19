import Repository from "@/astractions/repository";
import Buyers from "@/models/Buyer";
import FactoringIndicator from "@/models/FactoringIndicator";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class BuyerRepository extends Repository<Buyers> {

  url = '/SalesPersons';

  // specific key
  key = 'SalesPersons';

  async get<Buyers>(query?: string | undefined): Promise<Buyers[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const buyer = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(buyer);
    }

    const buyer = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(buyer));
    localStorage.setItem(this.key, enc);

    return buyer;
  }


  find<Buyers>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const Buyer: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Buyers(Buyer.find((e: any) => e?.SalesEmployeeCode === code) ?? {});
  }


  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Buyers> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Buyers> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Buyers> {
    throw new Error("Method not implemented.");
  }
}