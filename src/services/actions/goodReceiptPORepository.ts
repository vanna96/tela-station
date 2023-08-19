import Repository from "@/astractions/repository";
import request from "@/utilies/request";
import GoodReceiptPO from "@/models/GoodReceiptPO";

export default class GoodReceiptPORepository extends Repository<GoodReceiptPO> {
  url: string = "/InventoryGenEntries";
  query: string = "?$filter=U_DOCTYPE eq 'I'";
  // ?$filter=U_DOCTYPE eq 'I'

  public static documentSerie = {
    Document: "1470000113",
  };

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url + this.query)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new GoodReceiptPO(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return response;
  }


  async find<T>(id: any): Promise<any> {
    const goods = await request('GET', `${this.url}(${id})`).then((res: any) => new GoodReceiptPO(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return goods;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    if (isUpdate)
      return await request(
        "PATCH",
        this.url + "(" + id + ")",
        GoodReceiptPO.toUpdate(payload)
      );

    return await request("POST", this.url, GoodReceiptPO.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    return await request("PATCH", this.url, GoodReceiptPO.toUpdate(payload));
  }

  async delete(id: any): Promise<GoodReceiptPO> {
    throw new Error("Method not implemented.");
  }
}
