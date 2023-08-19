import Repository from "@/astractions/repository";
import FactoringIndicator from "@/models/FactoringIndicator";
import Level from "@/models/Level";
import WareBin from "@/models/WareBin";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class LevelRepository extends Repository<Level> {

  url = "/WarehouseSublevelCodes?$filter=WarehouseSublevel eq 3";

  // specific key
  key = 'level';

  async get<Level>(query?: string | undefined): Promise<Level[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const level = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(level);
    }

    const level = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(level));
    localStorage.setItem(this.key, enc);

    return level;
  }


  find<Level>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    const level: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return level.find((e: any) => e?.WarehouseCode == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Level> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<WareBin> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<FactoringIndicator> {
    throw new Error("Method not implemented.");
  }
}