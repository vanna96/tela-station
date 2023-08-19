import Repository from "@/astractions/repository";
import request from "@/utilies/request";
import StockTransferRequest from "@/models/StockTransferRequest";

export default class StockTransferRequestRepository extends Repository<StockTransferRequest> {
  url: string = "/InventoryTransferRequests";
  query: string = "?$filter=U_TRANSTYPE eq 'S'";

  public static documentSerie = {
    Document: "1470000113",
  };



  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url + this.query)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new StockTransferRequest(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return response;
  }


  async find<T>(id: any): Promise<any> {
    const stockTransfer = await request("GET", `${this.url}(${id})`)
      .then((res: any) => new StockTransferRequest(res.data))
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    return StockTransferRequest;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    if (isUpdate)
      return await request(
        "PATCH",
        this.url + "(" + id + ")",
        StockTransferRequest.toUpdate(payload)
      );

    return await request("POST", this.url, StockTransferRequest.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    return await request("PATCH", this.url, StockTransferRequest.toUpdate(payload));
  }

  async delete(id: any): Promise<StockTransferRequest> {
    throw new Error("Method not implemented.");
  }
}
