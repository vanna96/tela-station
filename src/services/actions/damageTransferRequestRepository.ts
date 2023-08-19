import Repository from "@/astractions/repository";
import request from "@/utilies/request";
import DamageTransfer from "../../models/DamageTransfer";

export default class DamageTransferRepository extends Repository<DamageTransfer> {
  url: string = "/InventoryTransferRequests?$filter=U_TRANSTYPE eq 'D'";

  public static documentSerie = {
    Document: "1470000113",
  };

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new DamageTransfer(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return response;
  }

  async find<T>(id: any): Promise<any> {
    const damageTransfer = await request("GET", `${this.url}(${id})`)
      .then((res: any) => new DamageTransfer(res.data))
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    return DamageTransfer;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    if (isUpdate)
      return await request(
        "PATCH",
        this.url + "(" + id + ")",
        DamageTransfer.toUpdate(payload)
      );

    return await request("POST", this.url, DamageTransfer.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    return await request("PATCH", this.url, DamageTransfer.toUpdate(payload));
  }

  async delete(id: any): Promise<DamageTransfer> {
    throw new Error("Method not implemented.");
  }
}
