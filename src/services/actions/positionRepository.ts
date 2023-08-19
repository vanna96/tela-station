import Repository from "@/astractions/repository";
import Position from "@/models/Position";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class PositionRepository extends Repository<Position> {

  url = '/EmployeePosition';

  // specific key
  key = 'EmployeePosition';

  async get<Position>(query?: string | undefined): Promise<Position[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const position = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(position);
    }

    const position = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(position));
    localStorage.setItem(this.key, enc);

    return position;
  }


  find<Position>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const position: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return new Position(position.find((e: any) => e?.PositionID === code) ?? {});
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Position> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Position> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Position> {
    throw new Error("Method not implemented.");
  }
}