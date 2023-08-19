import Model from './Model';

export default class EmployeesInfo extends Model {
    
    id: number;
    name: string;
    userCode : string;
    userName : string;
    email: string;
    branch: any[];
    department: any[];
    // EmployeeID, LastName, FirstName, JobTitle, Department, Branch, eMail
    
    constructor(json : any) {
        super()

        this.id = json['EmployeeID']
        this.name = `${json['FirstName']}, ${ json['LastName']} `
        this.userCode = json['FirstName']
        this.userName= `${json['FirstName']} ${ json['LastName']} `
        this.email = json['eMail']
        this.branch = json['Branch']
        this.department = json['Department']

    }
    
    toJson(update?: boolean) {
        return {
            id: this.id,
            name: this.name,
            userCode: this.userCode,
            userName: this.userName,
            email: this.email,
            branch: this.branch,
            department: this.department
        }
    }

}
