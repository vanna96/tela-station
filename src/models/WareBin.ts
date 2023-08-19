import Model from './Model';

export default class WareBin extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['WarehouseCode']
    this.name = json['WarehouseName']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}