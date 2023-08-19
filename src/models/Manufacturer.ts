import Model from './Model';


export default class Manufacturer extends Model {
    code: number;
    name: string;

    constructor(json: any) {
        super();
        this.code = json['Code'];
        this.name = json['ManufacturerName'];
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}