import Model from './Model';

export default class Position extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['PositionID']
    this.name = json['Name']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}