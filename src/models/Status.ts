import Model from './Model';

export default class Status extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['StatusId']
    this.name = json['Name']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}