import BusinessPartner from '@/models/BusinessParter';
import Repository from '../../astractions/repository';
import request from '../../utilies/request';
import BusinessPartnerRepository from './bussinessPartnerRepository';
import { IContactPersonList } from '../../astractions/index';
import Employee from '@/models/Employee';
export default class EmployeeRepository extends Repository<Employee> {

  url: string = '/EmployeesInfo';

  public static documentSerie = {
    Document: "22"
  }

  async get<T>(query?: string): Promise<T[]> {
    const response: any = await request('GET', this.url).then((res: any) => {
      const data = res?.data?.value?.map((e: any) => new Employee(e));
      return data;
    }).catch((e: Error) => {
      throw new Error(e.message);
    });

    return response;
  }

  async find<T>(id: any): Promise<any> {
    const employee = await request('GET', `${this.url}(${id})`).then((res: any) => new Employee(res.data))
      .catch((e: Error) => {
        throw new Error(e.message)
      })
    // const businessPartner: BusinessPartner = await new BusinessPartnerRepository().findContactEmployee(employee.cardCode!);

    return employee;
  }

  async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

    if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", Employee.toUpdate(payload));

    return await request('POST', this.url, Employee.toCreate(payload));
  }


  async patch(id: any, payload: any): Promise<any> {
    return await request('PATCH', this.url, Employee.toUpdate(payload));
  }


  async delete(id: any): Promise<Employee> {
    throw new Error('Method not implemented.');
  }

}