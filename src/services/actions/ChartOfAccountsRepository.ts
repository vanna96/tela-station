import Repository from "@/astractions/repository";
import ChartOfAccounts from "@/models/ChartOfAccounts";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class ChartOfAccountsRepository extends Repository<ChartOfAccounts> {
  url =
    "/ChartOfAccounts?$select=Code,Name,Balance,AccountType&$filter=ActiveAccount eq 'tYES'";

  // specific key
  key = "ChartOfAccounts";

  async get<ChartOfAccounts>(
    query?: string | undefined
  ): Promise<ChartOfAccounts[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const chartOfAccounts = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(chartOfAccounts);
    }

    const chartOfAccounts = await request("GET", this.url).then(
      (res: any) => res?.data?.value
    );
    const enc = Encryption.encrypt(this.key, JSON.stringify(chartOfAccounts));
    localStorage.setItem(this.key, enc);

    return chartOfAccounts;
  }

  find<ChartOfAccounts>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const chartOfAccounts: [] = JSON.parse(
      JSON.parse(Encryption.decrypt(this.key, data ?? "[]"))
    );
    return chartOfAccounts.find((e: any) => e?.Code == code);
  }

  post(
    payload: any,
    isUpdate?: boolean | undefined,
    id?: any
  ): Promise<ChartOfAccounts> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<ChartOfAccounts> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<ChartOfAccounts> {
    throw new Error("Method not implemented.");
  }
}
