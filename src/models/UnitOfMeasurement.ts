import Model from './Model';


export default class UnitOfMeasurement extends Model {
    id: number  | undefined;
    code: string | undefined;
    name: string | undefined;
    baseUoM?: number | undefined;
    collections?: [];


    constructor(json: any) {
        super();
        this.id = json['Id'];
        this.code = json['Code'];
        this.name = json['Name'];
        this.baseUoM = json['BaseUoM']
        this.collections= json['UoMGroupDefinitionCollection'];
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}


export class UOMCollection extends Model {

    quantity: number;
    active: boolean;

    constructor(json:any) {
        super()

        this.quantity = json['AlternateQuantity']
        this.active = json['Active']
    }

    toJson(update: boolean) {
        throw new Error('Method not implemented.');
    }
}