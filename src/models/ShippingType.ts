import Model from './Model';


export default class ShippingType extends Model {
    code: number;
    name: string;
    website?: string;


    constructor(json: any) {
        super();

        this.code = json['Code'];
        this.name = json['Name'];
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}