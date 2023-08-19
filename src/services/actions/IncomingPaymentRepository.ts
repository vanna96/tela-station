import IncomingPayment from "@/models/IncomingPayment";
import request, { axiosInstance } from "@/utilies/request";
import Repository from "../../astractions/repository";

export default class IncomingPaymentRepository extends Repository<IncomingPayment> {
  url: string = "/IncomingPayments";

  async get<IncomingPayment>(query?: any): Promise<IncomingPayment[]> {
    const { params } = query;
    return await axiosInstance
      .get("/IncomingPayments", { params })
      .then((res: any) =>
        res?.data?.value?.map((item: any) => new IncomingPayment(item))
      )
      .catch((error) => console.log(error));
  }

  async find<T>(query?: string | undefined): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async post(payload: any): Promise<any> {
    // return await request('POST', this.url, IncomingPayment.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    //  return await request('PATCH', this.url, IncomingPayment.toUpdate(payload));
  }

  async delete(id: any): Promise<IncomingPayment> {
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
      .then((res: any) => new IncomingPayment(res?.data))
      .catch((e) => {
        throw new Error(e);
      });

    return response;
  }
}
