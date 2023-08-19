import Repository from "@/astractions/repository";
import FactoringIndicator from "@/models/FactoringIndicator";
import WareBin from "@/models/WareBin";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class wareBinRepository extends Repository<WareBin> {

  url = "/Warehouses?$filter=EnableBinLocations eq 'tYES'&$select=WarehouseName,WarehouseCode";

  // specific key
  key = 'warebin';

  async get<WareBin>(query?: string | undefined): Promise<WareBin[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const wareBin = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(wareBin);
    }

    const wareBin = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(wareBin));
    localStorage.setItem(this.key, enc);

    return wareBin;
  }


  find<WareBin>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    const wareBin: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return wareBin.find((e: any) => e?.WarehouseCode == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<WareBin> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<WareBin> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<FactoringIndicator> {
    throw new Error("Method not implemented.");
  }
}