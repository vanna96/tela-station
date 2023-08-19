import Model from './Model';

export default class Buyers extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['SalesEmployeeCode']
    this.name = json['SalesEmployeeName']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}