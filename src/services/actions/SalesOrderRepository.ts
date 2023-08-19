import SalesOrder from "@/models/SalesOrder";
import request, { axiosInstance } from "@/utilies/request";
import Repository from "../../astractions/repository";

export default class SalesOrderRepository extends Repository<SalesOrder> {
  url: string = "/Orders";

  async get<SalesOrder>(query?: any): Promise<SalesOrder[]> {
    const { params } = query;
    return await axiosInstance
      .get("/Orders", { params })
      .then((res: any) =>
        res?.data?.value?.map((item: any) => new SalesOrder(item))
      )
      .catch((error) => console.log(error));
  }

  async find<T>(query?: string | undefined): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async post(payload: any): Promise<any> {
    // return await request('POST', this.url, SalesOrder.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    //  return await request('PATCH', this.url, SalesOrder.toUpdate(payload));
  }

  async delete(id: any): Promise<SalesOrder> {
    throw new Error("Method not implemented.");
  }

  async getCount(query?: any): Promise<number> {
    const { params } = query;
    return await axiosInstance
      .get(`${this.url}/$count`, { params })
      .then((res: any) => res?.data)
      .catch((e) => {
        throw new Error(e);
      });
  }

  async findByValue(id: any) {
    const response: any = await request("GET", `${this.url}(${id})`)
      .then((res: any) => new SalesOrder(res?.data))
      .catch((e) => {
        throw new Error(e);
      });

    return response;
  }
}
