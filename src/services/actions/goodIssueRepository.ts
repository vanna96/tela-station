import Repository from "@/astractions/repository";
import request from "@/utilies/request";
import GoodIssue from "@/models/GoodIssue";

export default class GoodIssueRepository extends Repository<GoodIssue> {
  url: string = "/InventoryGenExits";
  query: string = "?$filter=U_DOCTYPE eq 'I'";

  public static documentSerie = {
    Document: "1470000113",
  };

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request("GET", this.url + this.query)
      .then((res: any) => {
        const data = res?.data?.value?.map((e: any) => new GoodIssue(e));
        return data;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return response;
  }


  async find<T>(id: any): Promise<any> {
    const goodIssues = await request('GET', `${this.url}(${id})`).then((res: any) => new GoodIssue(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })

    return goodIssues;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
    if (isUpdate)
      return await request(
        "PATCH",
        this.url + "(" + id + ")",
        GoodIssue.toUpdate(payload)
      );

    return await request("POST", this.url, GoodIssue.toCreate(payload));
  }

  async patch(id: any, payload: any): Promise<any> {
    return await request("PATCH", this.url, GoodIssue.toUpdate(payload));
  }

  async delete(id: any): Promise<GoodIssue> {
    throw new Error("Method not implemented.");
  }
}
