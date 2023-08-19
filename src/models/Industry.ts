import Model from './Model';

export default class Industry extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['IndustryCode']
    this.name = json['IndustryName']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}