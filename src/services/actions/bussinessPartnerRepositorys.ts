import Repository from '../../astractions/repository';
import request from '../../utilies/request';
import BusinessPartnerRepository from './bussinessPartnerRepository';
import { IContactPersonList } from '../../astractions/index';
import BusinessPatners from '@/models/BusinessPartner';
export default class BussinessPartnersRepository extends Repository<BusinessPatners> {

  url: string = '/BusinessPartners';

  public static documentSerie = {
    Document: "22"
  }

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', this.url).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new BusinessPatners(e));
      return data;
    }).catch((e: Error) => {
      throw new Error(e.message);
    });

    return response;
  }

  async find<T>(id: any): Promise<any> {
    const businesspartner = await request('GET', `${this.url}(${id})`).then((res: any) => new BusinessPatners(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return businesspartner;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "('" + id + "')", BusinessPatners.toUpdate(payload));

    return await request('POST', this.url, BusinessPatners.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, BusinessPatners.toUpdate(payload));
  }


  async delete(id: any): Promise<BusinessPatners> {
    throw new Error('Method not implemented.');
  }

}