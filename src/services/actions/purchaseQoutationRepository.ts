import BusinessPartner from '@/models/BusinessParter';
import Repository from '../../astractions/repository';
import PurchaseAgreement from '../../models/PurchaseAgreement';
import request from '../../utilies/request';
import BusinessPartnerRepository from './bussinessPartnerRepository';
import { IContactPersonList } from '../../astractions/index';
import PurchaseQouatation from '@/models/PurchaseQoutation';

export default class PurchaseQoutationRepository extends Repository<PurchaseQouatation> {

  url: string = '/PurchaseQuotations';

  public static documentSerie = {
    Document: "540000006"
  }

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', this.url + query).then(async (res: any) => {
      const data = res?.data?.value?.map((e: any) => new PurchaseQouatation(e));
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
    const purchaseQoutation = await request('GET', `${this.url}(${id})`).then((res: any) => new PurchaseQouatation(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    const businessPartner: BusinessPartner = await new BusinessPartnerRepository().findContactEmployee(purchaseQoutation.CardCode!);

    // purchaseQoutation.email = businessPartner.email;
    // purchaseQoutation.phone = businessPartner.phone;
    purchaseQoutation.ContactPersonList = businessPartner.contactEmployee ?? [];

    return purchaseQoutation;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", new PurchaseQouatation(payload).toJson(true));

    return await request('POST', this.url, new PurchaseQouatation(payload).toJson());
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, new PurchaseQouatation(payload).toJson());
  }


  async delete(id: any): Promise<PurchaseQouatation> {
    throw new Error('Method not implemented.');
  }

}