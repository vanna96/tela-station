import Model from './Model';

export default class Holidays extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['HolidayCode']
    this.name = json['HolidayCode']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}