
import Encryption from '@/utilies/encryption';
import Repository from '../../astractions/repository';
import request from '../../utilies/request';

export default class TIOgeDataRepository extends Repository<any> {

  url: string = '/sml.svc/TL_OIGE';
  static get: any;

  key = 'TIOgeDataRepository';
  async get(query?: string | undefined): Promise<any[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const bin = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(bin);
    }

    const bin = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(bin));
    localStorage.setItem(this.key, enc);
    return bin;
  }

  getAll(): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};

    const salePersons: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '{}')));
    return salePersons
  }
  find(Code: string | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};

    const salePersons: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '{}')));
    return salePersons.find((e: any) => e?.Code == Code);
  }

  post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  patch(id: any, payload: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<any> {
    throw new Error("Method not implemented.");
  }


}
