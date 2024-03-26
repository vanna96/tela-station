
import Encryption from '@/utilies/encryption';
import Repository from '../../astractions/repository';
import request from '../../utilies/request';
import Binlocation from '@/models/Binlocation';

export default class BinlocationRepository extends Repository<Binlocation> {

  url: string = '/BinLocations';
  static get: any;

  key = 'BinLocation';
  async get<Binlocation>(query?: string | undefined): Promise<Binlocation[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const bin = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(bin);
    }

    const bin = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(bin));
    localStorage.setItem(this.key, enc);
    console.log(bin)
    return bin;
  }
  async documentTotal<T>(query?: string): Promise<number> {
    const response: any = await request('GET', this.url + '/$count' + query).then(async (res: any) => {
      return res.data;
    }).catch((e: Error) => {
      throw new Error(e.message);
    });

    return response;
  }
  async find<T>(id: any): Promise<any> {
    const binlocation = await request('GET', `${this.url}(${id})`).then((res: any) => new Binlocation(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return binlocation;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", Binlocation.toUpdate(payload));

    return await request('POST', this.url, Binlocation.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, Binlocation.toUpdate(payload));
  }


  async delete(id: any): Promise<Binlocation> {
    throw new Error('Method not implemented.');
  }

}