import Model from './Model';


export default class VatGroup extends Model {
    code: number;
    name: string;
    vatRate: number;
    category: string;

    constructor(json: any) {
        super();
        this.code = json['Code'];
        this.name = json['Name'];
        this.vatRate = json['VatGroups_Lines'][0]?.Rate;
        this.category = json['Category']?.replace('bovc', "");
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}