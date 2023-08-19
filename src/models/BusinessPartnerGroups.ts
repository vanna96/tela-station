import Model from './Model';


export default class BusinessPartnerGroups extends Model {
    code: number;
    name: string;

    constructor(json: any) {
        super();
        this.code = json['Code'];
        this.name = json['Name'];
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}