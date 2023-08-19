
import Repository from '../../astractions/repository';
import request from '../../utilies/request';
import Binlocation from '@/models/Binlocation';

export default class BinlocationRepository extends Repository<Binlocation> {

  url: string = '/BinLocations';


  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', this.url+query).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new Binlocation(e));
      return data;
    }).catch((e: Error) => {
      throw new Error(e.message);
    });

    return response;
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