import Model from './Model';


export default class Branch extends Model {
    code: number;
    name: string;
    description: number;

    constructor(json: any) {
        super();
        this.code = json['Code'];
        this.name = json['Name'];
        this.description = json['Description']
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}