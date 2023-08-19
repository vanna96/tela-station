import Model from './Model';



export default class GLAccount extends Model {

    code: string;
    name: string;

    constructor(json: any) {
        super();
        this.code = json['Code'];
        this.name = json['Name'];
    }

    toJson(update: boolean) {
        return {
            Code: this.code,
            Name : this.name,
       }
    }
}