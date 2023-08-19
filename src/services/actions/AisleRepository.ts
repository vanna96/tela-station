import Repository from "@/astractions/repository";
import Aisle from "@/models/Aisle";
import FactoringIndicator from "@/models/FactoringIndicator";
import Shelf from "@/models/Shelf";
import WareBin from "@/models/WareBin";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class AisleRepository extends Repository<Aisle> {

  url = "/WarehouseSublevelCodes?$filter=WarehouseSublevel eq 1";

  // specific key
  key = 'aisle';

  async get<Aisle>(query?: string | undefined): Promise<Aisle[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const aisle = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(aisle);
    }

    const aisle = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(aisle));
    localStorage.setItem(this.key, enc);

    return aisle;
  }


  find<Aisle>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    const aisle: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return aisle.find((e: any) => e?.Code == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Aisle> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Aisle> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Aisle> {
    throw new Error("Method not implemented.");
  }
}