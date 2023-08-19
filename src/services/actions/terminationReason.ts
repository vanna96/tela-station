import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import TerminationReason from "@/models/TerminationReason";

export default class TerminationReasonRepository extends Repository<TerminationReason> {

  url = '/TerminationReason';

  // specific key
  key = 'TerminationReason';

  async get<TerminationReason>(query?: string | undefined): Promise<TerminationReason[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const terminationReason = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(terminationReason);
    }

    const terminationReason = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(terminationReason));
    localStorage.setItem(this.key, enc);

    return terminationReason;
  }


  find<TerminationReason>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const terminationReason: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new TerminationReason(terminationReason.find((e: any) => e?.ReasonID === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<TerminationReason> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<TerminationReason> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<TerminationReason> {
    throw new Error("Method not implemented.");
  }
}