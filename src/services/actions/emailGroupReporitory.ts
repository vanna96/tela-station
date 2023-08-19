import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import EmailGroup from "@/models/EmailGroup";

export default class EmailGroupRepository extends Repository<EmailGroup> {

  url = '/EmailGroups';

  // specific key
  key = 'EmailGroups';

  async get<EmailGroup>(query?: string | undefined): Promise<EmailGroup[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const emailGroup = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(emailGroup);
    }

    const emailGroup = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(emailGroup));
    localStorage.setItem(this.key, enc);

    return emailGroup;
  }


  find<EmailGroup>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const emailGroup: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new EmailGroup(emailGroup.find((e: any) => e?.EmailGroupCode === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<EmailGroup> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<EmailGroup> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<EmailGroup> {
    throw new Error("Method not implemented.");
  }
}