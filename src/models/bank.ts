import Model from './Model';

export default class Bank extends Model {

  code: string;
  name: string;

  constructor(json: any) {
    super()

    this.code = json['BankCode']
    this.name = json['BankName']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}