export default class ChartOfAccounts {
  Code: number;
  Name: string;
  Balance: string;
  AccountType: string;

  constructor(json: any) {
    this.Code = json["Code"];
    this.Name = json["Name"];
    this.Balance = json["Balance"];
    this.AccountType = json["AccountType"];
  }
}
