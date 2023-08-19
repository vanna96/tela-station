import Repository from "@/astractions/repository";
import request from "@/utilies/request";
import StockTransferRequest from "@/models/StockTransferRequest";
import StockDamageRequest from "@/models/StockDamageRequest";

export default class StockDamageRequestRepository extends Repository<StockDamageRequest> {
  url: string = "/InventoryTransferRequests";
  query: string = "?$filter=U_TRANSTYPE eq 'D'";

  public static documentSerie = {
    Document: "1470000113",
  };



  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url + this.query)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new StockDamageRequest(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return response;
  }


  async find<T>(id: any): Promise<any> {
    const stockTransfer = await request("GET", `${this.url}(${id})`)
      .then((res: any) => new StockDamageRequest(res.data))
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    return StockDamageRequest;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    if (isUpdate)
      return await request(
        "PATCH",
        this.url + "(" + id + ")",
        StockDamageRequest.toUpdate(payload)
      );

    return await request("POST", this.url, StockDamageRequest.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    return await request("PATCH", this.url, StockDamageRequest.toUpdate(payload));
  }

  async delete(id: any): Promise<StockDamageRequest> {
    throw new Error("Method not implemented.");
  }
}
