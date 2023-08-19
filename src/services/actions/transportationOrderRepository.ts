import Repository from '../../astractions/repository';
import request from '../../utilies/request';
import TransportationOrder from '@/models/TransportationOrder';
export default class TransportationOrderRepository extends Repository<TransportationOrder> {

  url: string = 'view.svc/Biz_TransportationOrderB1SLQuery';
  query: string = "?$filter=U_TRANSPSTATUS eq 'Open'";


  public static documentSerie = {
    Document: "22"
  }


  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url + this.query)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new TransportationOrder(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return response;
  }

  async find<T>(id: any): Promise<any> {
    const data = await request('GET', `${this.url}(${id})`).then((res: any) => new TransportationOrder(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return data;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", TransportationOrder.toUpdate(payload));

    return await request('POST', this.url, TransportationOrder.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, TransportationOrder.toUpdate(payload));
  }


  async delete(id: any): Promise<TransportationOrder> {
    throw new Error('Method not implemented.');
  }

}