import Repository from "@/astractions/repository";
import getDocumentNumberingByCode from "@/constants/ObjectType";
import DocumentNumbering from "@/models/DocumentNumbering";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class DocumentNumberingRepository extends Repository<DocumentNumbering> {

  url = '/view.svc/Biz_DocNumB1SLQuery';

  // specific key
  key = 'documentNumbering';

  async get<DocumentNumbering>(query?: string | undefined): Promise<any[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const document = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(document);
    }

    const document = await request('GET', this.url).then((res: any) => res?.data?.value?.map((e: any) => {
      const code = getDocumentNumberingByCode(e?.ObjectCode);
      return {
        key: e["id__"],
        ...e,
        InitialNum: e?.UpdCounter,
        LastNum: e?.AutoKey,
        ObjectName: code,
        ObjectCode: e?.ObjectCode,
        DocSubType: e?.DocSubType
      };
    }));
    const enc = Encryption.encrypt(this.key, JSON.stringify(document));
    localStorage.setItem(this.key, enc);

    return document;
  }


  find<DocumentNumbering>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const dimension: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return dimension.find((e: any) => e?.Code == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<DocumentNumbering> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<DocumentNumbering> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<DocumentNumbering> {
    throw new Error("Method not implemented.");
  }
}