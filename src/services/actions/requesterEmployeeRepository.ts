import Repository from "@/astractions/repository";
import EmployeesInfo from "@/models/EmployeesInfo";
import request from "@/utilies/request";

export default class requesterEmployeeRepository extends Repository<EmployeesInfo> {
  url = "/EmployeesInfo";

  select = [
    "EmployeeID",
    "LastName",
    " FirstName",
    "JobTitle",
    "Department",
    "Branch",
    "eMail",
  ];
  private static url1 = "/EmployeesInfo";

  private static select1 = [
    "EmployeeID",
    "LastName",
    " FirstName",
    "JobTitle",
    "Department",
    "Branch",
    "eMail",
  ];

  async get<EmployeesInfo>(query?: string | undefined): Promise<EmployeesInfo[]> {
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

  public static async getAll<EmployeesInfo>(
    query?: string | undefined
  ): Promise<EmployeesInfo[]> {
    const response = await request(
      "GET",
      this.url1 + "?$select=" + this.select1.join(",")
    )
      .then((res: any) => res?.data?.value)
      .catch((e: Error) => {
        throw new Error(e.message);
      });

    if (!response?.data) throw new Error("No Data");
    return response.data?.map((e: any) => new EmployeesInfo(e));
  }

  find<T>(query?: string | undefined): Promise<T> {
    throw new Error("Method not implemented.");
  }

  post(payload: any): Promise<EmployeesInfo> {
    throw new Error("Method not implemented.");
  }

  patch(id: any, payload: any): Promise<EmployeesInfo> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<EmployeesInfo> {
    throw new Error("Method not implemented.");
  }
}
