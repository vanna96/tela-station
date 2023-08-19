import Repository from "@/astractions/repository";
import FactoringIndicator from "@/models/FactoringIndicator";
import Shelf from "@/models/Shelf";
import WareBin from "@/models/WareBin";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class ShelfRepository extends Repository<Shelf> {

  url = "/WarehouseSublevelCodes?$filter=WarehouseSublevel eq 2";

  // specific key
  key = 'shelf';

  async get<Shelf>(query?: string | undefined): Promise<Shelf[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const shelf = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(shelf);
    }

    const shelf = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(shelf));
    localStorage.setItem(this.key, enc);

    return shelf;
  }


  find<Shelf>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    const shelf: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return shelf.find((e: any) => e?.WarehouseCode == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Shelf> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<WareBin> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<FactoringIndicator> {
    throw new Error("Method not implemented.");
  }
}