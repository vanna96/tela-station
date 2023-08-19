import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import HouseBankAccount from "@/models/HouseBankAccount";
export default class HousebankAccountRepository extends Repository<HouseBankAccount> {

  url = '/HouseBankAccounts';

  // specific key
  key = 'HouseBankAccounts';

  async get<HouseBankAccount>(query?: string | undefined): Promise<HouseBankAccount[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const houseBankAccount = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(houseBankAccount);
    }

    const houseBankAccount = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(houseBankAccount));
    localStorage.setItem(this.key, enc);

    return houseBankAccount;
  }


  find<HouseBankAccount>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const houseBankAccount: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new HouseBankAccount(houseBankAccount.find((e: any) => e?.BankCode === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<HouseBankAccount> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<HouseBankAccount> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<HouseBankAccount> {
    throw new Error("Method not implemented.");
  }
}