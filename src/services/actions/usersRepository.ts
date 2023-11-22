import Repository from "@/astractions/repository";
import Users from "@/models/UsersCode";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class UsersRepository extends Repository<Users> {

  url = '/Users';
  querey = '?$select=UserCode, InternalKey';
  // specific key
  key = 'Users';

  async get<Users>(query?: string | undefined): Promise<Users[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const user = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(user);
    }

    const user = await request('GET', this.url + this.querey).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(user));
    localStorage.setItem(this.key, enc);

    return user;
  }

  find<User>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const branchs: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return branchs.find((e: any) => e?.InternalKey == code);
  }
  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Users> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Users> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Users> {
    throw new Error("Method not implemented.");
  }
}