import Model from './Model';


export default class PaymentMethod extends Model {
    id: number;
    name: string;
    type: string;

    constructor(json: any) {
        super();

        this.id = json['PaymentMethodCode'];
        this.name = json['Description'];
        this.type = json['Type'];
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}