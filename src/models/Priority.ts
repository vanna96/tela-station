import Model from './Model';

export default class Priority extends Model {

  code: string;
  name: string;


  constructor(json: any) {
    super()

    this.code = json['Priority']
    this.name = json['PriorityDescription']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

}