import Model from './Model';


export default class DocumentNumbering extends Model {
  defaultSeries: string;
  firstNo: Number;
  lastNo: number;
  constructor(json: any) {
    super();
    this.defaultSeries = json['DfltSeries'];
    this.firstNo = json['UpdCounter'];
    this.lastNo = json['AutoKey'];
  }


  toJson(update: boolean) {
    return {}
  }
}