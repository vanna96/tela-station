import Repository from "../../astractions/repository";
import SalesQuotation from "../../models/SalesQuotation";
import request, { axiosInstance } from "../../utilies/request";

export default class SalesQuotationRepository extends Repository<SalesQuotation> {
  url: string = "/Quotations";
  // ?$top=100

  async get<T>(query?: any): Promise<T[]> {
    const response: any = await request("GET", `${this.url}`)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new SalesQuotation(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });

    return response;
  }

  async find<T>(query?: string | undefined): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async post(payload: any): Promise<any> {
    // return await request('POST', this.url, SalesQuotation.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    //  return await request('PATCH', this.url, SalesQuotation.toUpdate(payload));
  }

  async delete(id: any): Promise<SalesQuotation> {
    throw new Error("Method not implemented.");
  }

  async findByValue(id: any) {
    const response: any = await request("GET", `/Quotations(${id})`)
      .then((res: any) => new SalesQuotation(res?.data))
      .catch((e) => {
        throw new Error(e);
      });

    return response;
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
}
