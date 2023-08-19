import Model from './Model';

export default class PaymentBlock extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['AbsEntry']
    this.name = json['PaymentBlockCode']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}