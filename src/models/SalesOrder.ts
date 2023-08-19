import Model from "./Model";

export default class SalesOrder extends Model {
  key: string;
  DocEntry: string;
  DocNum: string;
  DocType: string;
  CardCode: string;
  CardName: string;
  JournalMemo: string;
  VATRegNum: string;
  DocTotal: string;
  Comments: string;
  DocDate: string;
  DocDueDate: string;
  DocumentStatus: string;
  CreationDate: string;
  UpdateDate: string;
  Reference1: string;
  Series: string;
  DocCurrency: string;
  ContactPerson: string;
  ContactPersonCode: string;
  DocumentLines: string;
  VatSum: string;
  DiscountPercent: string;
  SalesPersonCode: string;
  CreateQRCodeFrom: string;
  CancelDate: string;
  RequriedDate: string;
  FederalTaxID: string;
  ImportFileNum: string;
  AttachmentEntry: string;
  Address2: string;
  Address: string;
  PaymentMethod: string;
  CentralBankIndicator: string;
  CashDiscountDateOffset: string;
  NumAtCard: string;
  DocumentsOwner: string;
  Rounding: string;
  PickRemark: string;
  Pick: string;
  PaymentGroupCode: string;
  paymentMethods: string;
  Indicator: string;

  constructor(json: any) {
    super();

    this.key = json["DocEntry"];
    this.DocEntry = json["DocEntry"];
    this.DocNum = json["DocNum"];
    this.DocType = json["DocType"];
    this.CardCode = json["CardCode"];
    this.CardName = json["CardName"];
    this.JournalMemo = json["JournalMemo"];
    this.VATRegNum = json["VATRegNum"];
    this.DocTotal = json["DocTotal"];
    this.Comments = json["Comments"];
    this.DocDate = json["DocDate"].split("T")[0];
    this.DocDueDate = json["DocDueDate"].split("T")[0];
    this.DocumentStatus = json["DocumentStatus"];
    this.CreationDate = json["CreationDate"].split("T")[0];
    this.UpdateDate = json["UpdateDate"];
    this.Reference1 = json["Reference1"];
    this.Series = json["Series"];
    this.ContactPerson = json["ContactPerson"];
    this.DocCurrency = json["DocCurrency"];
    this.ContactPersonCode = json["ContactPersonCode"];
    this.DocumentLines = json["DocumentLines"];
    this.VatSum = json["VatSum"];
    this.DiscountPercent = json["DiscountPercent"];
    this.Address2 = json["Address2"];
    this.PaymentMethod = json["PaymentMethod"];
    this.CentralBankIndicator = json["CentralBankIndicator"];
    this.CashDiscountDateOffset = json["CashDiscountDateOffset"];
    this.Address = json["Address"];
    this.SalesPersonCode = json["SalesPersonCode"];
    this.CreateQRCodeFrom = json["CreateQRCodeFrom"];
    this.CancelDate = json["CancelDate"];
    this.RequriedDate = json["RequriedDate"];
    this.FederalTaxID = json["FederalTaxID"];
    this.ImportFileNum = json["ImportFileNum"];
    this.AttachmentEntry = json["AttachmentEntry"];
    this.NumAtCard = json["NumAtCard"];
    this.DocumentsOwner = json["DocumentsOwner"];
    this.Rounding = json["Rounding"];
    this.PickRemark = json["PickRemark"];
    this.Pick = json["Pick"];
    this.PaymentGroupCode = json["PaymentGroupCode"];
    this.paymentMethods = json["paymentMethods"];
    this.Indicator = json["Indicator"];
  }

  toJson(update: boolean) {
    throw new Error("Method not implemented.");
  }
}
