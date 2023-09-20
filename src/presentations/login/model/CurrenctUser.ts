


export default class CurrentUser {
    UserCode: string;
    UserName: string;
    Email: string;
    Branch: string;
    Department: string;
    UserBranchAssignment: any[];

    constructor(json: any) {
        this.UserCode = json['UserCode'];
        this.UserName = json['UserName'];
        this.Email = json['eMail'];
        this.Branch = json['Branch'];
        this.Department = json['Department'];
        this.UserBranchAssignment = json['UserBranchAssignment']
    }
}