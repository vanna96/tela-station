import Model from './Model';

export default class Users extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['InternalKey']
    this.name = json['UserCode']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}