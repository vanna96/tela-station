import Model from './Model';


export default class Dimension extends Model {
  code: number;
  name: string;
  description: number;
  active: any;
  constructor(json: any) {
    super();
    this.code = json['DimensionCode'];
    this.name = json['DimensionName'];
    this.description = json['DimensionDescription'];
    this.active = json["IsActive"] === "tYES" ? "Yes" : "No"
  }


  toJson(update: boolean) {
    return {}
  }
}