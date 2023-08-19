import Model from './Model';

export default class PriceList extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['PriceListNo']
    this.name = json['PriceListName']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}