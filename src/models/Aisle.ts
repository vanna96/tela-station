import Model from './Model';

export default class Aisle extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['Code']
    this.name = json['Code']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}