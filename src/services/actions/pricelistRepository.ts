import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import PriceList from "@/models/PriceList";
import request from "@/utilies/request";

export default class PriceListRepository extends Repository<PriceList> {

  url = '/PriceLists';

  // specific key
  key = 'PriceLists';

  async get<PriceList>(query?: string | undefined): Promise<PriceList[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const priceList = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(priceList);
    }

    const priceList = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(priceList));
    localStorage.setItem(this.key, enc);

    return priceList;
  }


  find<PriceList>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const priceList: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return (priceList.find((e: any) => e?.PriceListNo === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<PriceList> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<PriceList> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<PriceList> {
    throw new Error("Method not implemented.");
  }
}