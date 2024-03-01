import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import LineofBusiness from "@/models/LineofBusiness";
export default class LineofBusinessRepository extends Repository<LineofBusiness> {

  url = "/DistributionRules?$filter=InWhichDimension eq 1 and Active eq 'Y'&$select=FactorCode,FactorDescription";

  // specific key
  key = 'DistributionRules';

  async get<LineofBusiness>(query?: string | undefined): Promise<LineofBusiness[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const lineofBusiness = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(lineofBusiness);
    }

    const lineofBusiness = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(lineofBusiness));
    localStorage.setItem(this.key, enc);

    return lineofBusiness;
  }


  find<LineofBusiness>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const priority: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new LineofBusiness(priority.find((e: any) => e?.LineofBusiness === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<LineofBusiness> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<LineofBusiness> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<LineofBusiness> {
    throw new Error("Method not implemented.");
  }
}