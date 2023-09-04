import Model from './Model';


export default class Branch extends Model {
    code: number;
    name: string;
    // description: number;

    constructor(json: any) {
        super();
        this.code = json['BPLID'];
        this.name = json['BPLName'];
        // this.description = json['Description']
    }
    
    
    toJson(update: boolean) {
       return {}
    }
}