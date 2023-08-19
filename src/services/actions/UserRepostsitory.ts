import Repository from "@/astractions/repository";
import Branch from "@/models/Branch";
import Dimension from "@/models/Dimension";
import User from "@/models/User";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class UsersRepository extends Repository<User> {

  url = '/Users';

  // specific key
  key = 'users';

  async get<User>(query?: string | undefined): Promise<User[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const user = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(user);
    }

    const user = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(user));
    localStorage.setItem(this.key, enc);

    return user;
  }


  find<User>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const user: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return user.find((e: any) => e?.Code == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<User> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<User> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<User> {
    throw new Error("Method not implemented.");
  }
}