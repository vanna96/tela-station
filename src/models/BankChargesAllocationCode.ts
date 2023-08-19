import Model from './Model';

export default class BankChargesAllocationCodes extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['Description']
    this.name = json['Code']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}