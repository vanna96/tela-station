import Repository from "@/astractions/repository";
import Users from "@/models/User";
import request from "@/utilies/request";

export default class requesterRepository extends Repository<Users> {
  url = "/Users";

  select = ["UserCode", "UserName", " eMail", "Branch", "Department"];

  private static url1 = "/Users";

  private static select1 = [
    "UserCode", "UserName", " eMail", "Branch", "Department"
  ];

  async get<Users>(query?: string | undefined): Promise<Users[]> {
    const response = await request(
      "GET",
      this.url + "?$select=" + this.select.join(",")
    )
      .then((res: any) => res?.data?.value)
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    if (!response) return [];

    return response;
  }

  public static async getAll<Users>(
    query?: string | undefined
  ): Promise<Users[]> {
    const response = await request(
      "GET",
      this.url1 + "?$select=" + this.select1.join(",")
    )
      .then((res: any) => res?.data?.value)
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    if (!response?.data) throw new Error("No Data");
    return response.data?.map((e: any) => new Users(e));
  }

  find<T>(query?: string | undefined): Promise<T> {
    throw new Error("Method not implemented.");
  }

  post(payload: any): Promise<Users> {
    throw new Error("Method not implemented.");
  }

  patch(id: any, payload: any): Promise<Users> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Users> {
    throw new Error("Method not implemented.");
  }
}
