import Model from './Model';

export default class Territory extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['TerritoryID']
    this.name = json['Description']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}