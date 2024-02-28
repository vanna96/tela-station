import Model from './Model';

export default class LineofBusiness extends Model {

  factorCode: string;
  factorDescription: string;


  constructor(json: any) {
    super()

    this.factorCode = json['FactorCode']
    this.factorDescription = json['FactorDescription']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}