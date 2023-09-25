import Model from './Model';

export default class WareBinLocation extends Model {

  WhsCode: string;
  BinCode: string;
  BinAbsEntry: string;
  ItemCode?: string;

  constructor(json: any) {
    super()
    this.ItemCode = json['ItemCode']
    this.WhsCode = json['WhsCode']
    this.BinCode = json['BinCode']
    this.BinAbsEntry = json['BinAbsEntry']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}

