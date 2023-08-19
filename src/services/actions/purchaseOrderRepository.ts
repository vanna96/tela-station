import BusinessPartner from '@/models/BusinessParter';
import Repository from '../../astractions/repository';
import request from '../../utilies/request';
import BusinessPartnerRepository from './bussinessPartnerRepository';
import { IContactPersonList } from '../../astractions/index';
import PurchaseOrder from '@/models/PurchaseOrder';
export default class PurchaseOrderRepository extends Repository<PurchaseOrder> {

  url: string = '/PurchaseOrders?$top=10';

  public static documentSerie = {
    Document: "22"
  }

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', this.url).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new PurchaseOrder(e));
      return data;
    }).catch((e: Error) => {
      throw new Error(e.message);
    });

    return response;
  }

  async find<T>(id: any): Promise<any> {
    const purchaseOrder = await request('GET', `${this.url?.replace('?$top=10', '')}(${id})`).then((res: any) => new PurchaseOrder(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })
    const businessPartner: BusinessPartner = await new BusinessPartnerRepository().findContactEmployee(purchaseOrder.cardCode!);
    purchaseOrder.contactPersonList = businessPartner.contactEmployee ?? [];

    return purchaseOrder;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", PurchaseOrder.toUpdate(payload));

    return await request('POST', this.url, PurchaseOrder.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, PurchaseOrder.toUpdate(payload));
  }


  async delete(id: any): Promise<PurchaseOrder> {
    throw new Error('Method not implemented.');
  }

}