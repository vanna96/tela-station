import { useParams } from 'react-router-dom';
import Repository from '../../astractions/repository';
import request from '../../utilies/request';
import RouteMaster from '@/models/RouteMaster';

export default class RouteMasterRepository extends Repository<RouteMaster> {


  url: string =   `view.svc/Biz_RouteMaintainceB1SLQuery`;
  // 'view.svc/Biz_VehicleB1SLQuery';


  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', this.url).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new RouteMaster(e));
      return data;
    }).catch((e: Error) => {
      throw new Error(e.message);
    });

    return response;
  }

  async find<T>(id: any): Promise<any> {
    const data = await request('GET', `${this.url}(${id})`).then((res: any) => new RouteMaster(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return data;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "('" + id + "')", RouteMaster.toUpdate(payload));

    return await request('POST', this.url, RouteMaster.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, RouteMaster.toUpdate(payload));
  }


  async delete(id: any): Promise<RouteMaster> {
    throw new Error('Method not implemented.');
  }

}