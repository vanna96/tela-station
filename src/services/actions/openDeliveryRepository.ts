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



export default class OpenDeliveryRepository extends Repository<OpenDelivery> {
  query: any[] = [
    "DocEntry",
    "DocNum",
    "CardCode",
    "CardName",
    "DocType",
    "DocDate",
    "DocDueDate",
    "TaxDate",
    "DocTotal",
    "U_TRANSTATUS",
  ];
  queryFilter: any =
    "&$filter=(U_TRANSTATUS eq 'OPEN' or U_TRANSTATUS eq 'CLOSED')";
  url: string = '/DeliveryNotes';

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', `${this.url}?$top=10&$select=${this.query.join(",")}${this.queryFilter }`).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new OpenDelivery(e));
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