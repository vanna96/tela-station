import Model from './Model';

export default class User extends Model {
    
    id: number;
    code : string;
    name : string;
    email: string;
    branch: any[];
    department: any[];
    
    constructor(json : any) {
        super()

        this.id = json['InternalKey']
        this.name = json['UserName']
        this.code = json['UserCode']
        this.email = json['eMail']
        this.branch = json['Branch']
        this.department = json['Department']

    }
    
    toJson(update?: boolean) {
        return {
            id: this.id,
            name: this.name,
            userCode: this.code,
            userName: this.name,
            email: this.email,
            branch: this.branch,
            department: this.department
        }
    }

}
