import Repository from "@/astractions/repository";
import Territory from "@/models/Territory";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class TerritoryRepository extends Repository<Territory> {

  url = '/Territories';

  // specific key
  key = 'Territories';

  async get<Territory>(query?: string | undefined): Promise<Territory[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const territory = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(territory);
    }

    const territory = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(territory));
    localStorage.setItem(this.key, enc);

    return territory;
  }


  find<Territory>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const territory: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Territory(territory.find((e: any) => e?.TerritoryID === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Territory> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Territory> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Territory> {
    throw new Error("Method not implemented.");
  }
}