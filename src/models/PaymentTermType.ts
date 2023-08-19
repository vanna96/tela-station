import Model from './Model';


export default class PaymentTermType extends Model {
    id: number;
    name: string;
    discount: string;

    constructor(json: any) {
        super();

        this.id = json['GroupNumber'];
        this.name = json['PaymentTermsGroupName'];
        this.discount = json['GeneralDiscount'];
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}