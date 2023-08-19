import BusinessPartner from "@/models/BusinessParter";
import Repository from "../../astractions/repository";
import GoodReturn from "../../models/GoodReturn";
import request from "../../utilies/request";
import BusinessPartnerRepository from "./bussinessPartnerRepository";

export default class GoodReturnRepository extends Repository<GoodReturn> {
  url: string = "/GoodsReturnRequest";

  public static documentSerie = {
    Document: "1250000025",
    DocumentSubType: "S",
  };

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url + query)
      .then(async (res: any) => {
        const data = res?.data?.value?.map((e: any) => new GoodReturn(e));
        return data;
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
    console.log(response);
    return response;
  }

  async documentTotal<T>(query?: string): Promise<number> {
    const response: any = await request("GET", this.url + "/$count" + query)
      .then(async (res: any) => {
        return res.data;
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    return response;
  }

  async find<T>(id: any): Promise<any> {
    const data = await request("GET", `${this.url}(${id})`)
      .then((res: any) => new GoodReturn(res.data))
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    const businessPartner: BusinessPartner =
      await new BusinessPartnerRepository().findContactEmployee(data.CardCode!);
    // data.Email = businessPartner.email;
    // data.Phone = businessPartner.phone;
    data.ContactPersonList = businessPartner.contactEmployee ?? [];

    return data;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    if (isUpdate)
      return await request(
        "PATCH",
        this.url + "(" + id + ")",
        new GoodReturn(payload).toJson(true)
      );

    console.log(new GoodReturn(payload).toJson())
    return await request("POST", this.url, new GoodReturn(payload).toJson());
  }

  async patch(id: any, payload: any): Promise<any> {
    return await request("PATCH", this.url, new GoodReturn(payload).toJson());
  }

  async delete(id: any): Promise<GoodReturn> {
    throw new Error("Method not implemented.");
  }
}
