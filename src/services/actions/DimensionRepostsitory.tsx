import Repository from "@/astractions/repository";
import Branch from "@/models/Branch";
import Dimension from "@/models/Dimension";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class DimensionRepository extends Repository<Dimension> {

  url = '/Dimensions';

  // specific key
  key = 'dimensions';

  async get<Dimension>(query?: string | undefined): Promise<Dimension[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const dimension = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(dimension);
    }

    const dimension = await request('GET', this.url).then((res: any) => res?.data?.value?.map((e:any) => {
      return {
          key: e?.DimensionCode,
          DimensionCode: e?.DimensionCode,
          DimensionName: e?.DimensionName,
          IsActive: e?.IsActive?.slice(1),
          DimensionDescription: e?.DimensionDescription,
      }
    }));
    const enc = Encryption.encrypt(this.key, JSON.stringify(dimension));
    localStorage.setItem(this.key, enc);

    return dimension;
  }


  find<Dimension>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const dimension: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return dimension.find((e: any) => e?.Code == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Dimension> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Dimension> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Dimension> {
    throw new Error("Method not implemented.");
  }
}