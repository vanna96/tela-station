import Repository from "@/astractions/repository";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";
import PaymentBlock from "@/models/PaymentBlock";
export default class PaymentBlockRepository extends Repository<PaymentBlock> {

  url = '/PaymentBlocks';

  // specific key
  key = 'PaymentBlocks';

  async get<PaymentBlock>(query?: string | undefined): Promise<PaymentBlock[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const paymentBlock = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(paymentBlock);
    }

    const paymentBlock = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(paymentBlock));
    localStorage.setItem(this.key, enc);

    return paymentBlock;
  }


  find<PaymentBlock>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const paymentBlock: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new PaymentBlock(paymentBlock.find((e: any) => e?.AbsEntry === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<PaymentBlock> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<PaymentBlock> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<PaymentBlock> {
    throw new Error("Method not implemented.");
  }
}