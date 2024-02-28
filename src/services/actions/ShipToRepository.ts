import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import ShipTo from "@/models/ShipTo";
export default class ShipToRepository extends Repository<ShipTo> {

  url = '/sml.svc/TL_BPADDRESS';

  // specific key
  key = 'ShipTo';

  async get<ShipTo>(query?: string | undefined): Promise<ShipTo[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const shipto = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(shipto);
    }

    const shipto = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(shipto));
    localStorage.setItem(this.key, enc);

    return shipto;
  }


  find<ShipTo>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const shipto: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new ShipTo(shipto.find((e: any) => e?.ShipTo === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<ShipTo> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<ShipTo> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<ShipTo> {
    throw new Error("Method not implemented.");
  }
}