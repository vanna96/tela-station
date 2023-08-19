import BusinessPartner from '@/models/BusinessParter';
import Repository from '../../astractions/repository';
import PurchaseAgreement from '../../models/PurchaseAgreement';
import request from '../../utilies/request';
import BusinessPartnerRepository from './bussinessPartnerRepository';
import { IContactPersonList } from '../../astractions/index';
import PurchaseQouatation from '@/models/PurchaseQoutation';
import Warehouses from '@/models/Warehouses';

export default class WarehouseRepository extends Repository<Warehouses> {

  url: string = '/Warehouses';

  
  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', this.url+query).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new Warehouses(e));
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
    const warehouse = await request('GET', `${this.url}(${id})`).then((res: any) => new Warehouses(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return warehouse;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "('" + id + "')", Warehouses.toUpdate(payload));

    return await request('POST', this.url, Warehouses.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, Warehouses.toUpdate(payload));
  }


  async delete(id: any): Promise<Warehouses> {
    throw new Error('Method not implemented.');
  }

}