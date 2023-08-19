import Model from './Model';

export default class Manager extends Model {
  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['EmployeeID']
    this.name = json['FirstName']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}