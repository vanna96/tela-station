import BusinessPartner from '@/models/BusinessParter';
import Repository from '../../astractions/repository';
import PurchaseAgreement from '../../models/PurchaseAgreement';
import request from '../../utilies/request';
import BusinessPartnerRepository from './bussinessPartnerRepository';
import { IContactPersonList } from '../../astractions/index';
import PurchaseQouatation from '@/models/PurchaseQoutation';
import Warehouses from '@/models/Warehouses';
import Vehicel from '@/models/Vehicel';
import OpenDelivery from '@/models/OpenDelivery';
import OpenTransportation from '@/models/OpenTransportation';



export default class OpenTransportationRepository extends Repository<OpenTransportation> {

  url: string = '/view.svc/Biz_TransportationOrderB1SLQuery';
  filter:string = "?$filter=U_TRANSPSTATUS eq 'Open'";

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', `${this.url}${this.filter }`).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new OpenTransportation(e));
      return data;
    }).catch((e: Error) => {
      throw new Error(e.message);
    });
    return response;
  }

  async find<T>(id: any): Promise<any> {
    const vehicel = await request('GET', `${this.url}(${id})`).then((res: any) => new Vehicel(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return vehicel;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "('" + id + "')", Vehicel.toUpdate(payload));

    return await request('POST', this.url, Vehicel.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, Vehicel.toUpdate(payload));
  }


  async delete(id: any): Promise<Vehicel> {
    throw new Error('Method not implemented.');
  }

}