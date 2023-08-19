// import BusinessPartner from '@/models/BusinessParter';
// import Repository from '../../astractions/repository';
// import PurchaseAgreement from '../../models/PurchaseAgreement';
// import request from '../../utilies/request';
// import BusinessPartnerRepository from './bussinessPartnerRepository';
// import { IContactPersonList } from '../../astractions/index';
// import PurchaseQouatation from '@/models/PurchaseQoutation';
// import Warehouses from '@/models/Warehouses';
// import Driver from '@/models/Driver';

// export default class DriverRepository extends Repository<Driver> {

//   url: string = "/EmployeesInfo?$filter = U_Driver eq 'Yes'";


//   async get<T>(query?: string): Promise<T[]> {
//     const response: any = await request('GET', this.url).then((res: any) => {
//       const data = res?.data?.value?.map((e: any) => new Driver(e));
//       return data;
//     }).catch((e: Error) => {
//       throw new Error(e.message);
//     });

//     return response;
//   }

//   async find<T>(id: any): Promise<any> {
//     const warehouse = await request('GET', `${this.url}(${id})`).then((res: any) => new Driver(res.data))
//       .catch((e: Error) => {
//         throw new Error(e.message)
//       })

//     return warehouse;
//   }

//   async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

//     if (isUpdate) return await request('PATCH', this.url + "('" + id + "')", Driver.toUpdate(payload));

//     return await request('POST', this.url, Warehouses.toCreate(payload));
//   }


//   async patch(id: any, payload: any): Promise<any> {
//     return await request('PATCH', this.url, Warehouses.toUpdate(payload));
//   }


//   async delete(id: any): Promise<Warehouses> {
//     throw new Error('Method not implemented.');
//   }

// }
import Repository from "@/astractions/repository";
import Country from "@/models/Country";
import Driver from "@/models/Driver";
import FactoringIndicator from "@/models/FactoringIndicator";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class DriverRepository extends Repository<Driver> {

  url = "/EmployeesInfo?$filter = U_Driver eq 'Yes'";

  // specific key
  key = 'driver';

  async get<Driver>(query?: string | undefined): Promise<Driver[]> {
    const data = localStorage.getItem(this.key);
    if (data) {
      const driver = JSON.parse(Encryption.decrypt(this.key, data));
      return JSON.parse(driver);
    }

    const driver = await request('GET', this.url).then((res: any) => res?.data?.value);
    const enc = Encryption.encrypt(this.key, JSON.stringify(driver));
    localStorage.setItem(this.key, enc);

    return driver;
  }




  find<Driver>(code: number | undefined | null): any {
    const data = localStorage.getItem(this.key);
    if (!data) return {};
    const driver: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
    return driver.find((e: any) => e?.Code == code);
  }

  post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Driver> {
    throw new Error("Method not implemented.");
  }
  patch(id: any, payload: any): Promise<Driver> {
    throw new Error("Method not implemented.");
  }

  delete(id: any): Promise<Country> {
    throw new Error("Method not implemented.");
  }
}