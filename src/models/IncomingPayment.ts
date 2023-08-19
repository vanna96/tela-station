import Model from "./Model";

export default class IncomingPayment extends Model {
  key: string;
  DocEntry: string;
  DocNum: string;
  DocType: string;
  CardCode: string;
  CardName: string;
  VATRegNum: string;
  DocDate: string;
  Reference1: string;
  Series: string;
  DocCurrency: string;
  ContactPersonCode: string;
  DiscountPercent: string;
  Address: string;
  AttachmentEntry: string;
  JournalRemarks: string;
  TaxDate: string;
  DueDate: string;
  DocRate: string;
  PaymentInvoices: string;
  CashSum: string;
  TransferSum: string;
  CashAccount: string;
  PaymentChecks: string;
  PayToCode: string;
  PaymentAccounts: string;

  constructor(json: any) {
    super();

    this.key = json["DocEntry"];
    this.DocEntry = json["DocEntry"];
    this.DocNum = json["DocNum"];
    this.DocType = json["DocType"];
    this.CardCode = json["CardCode"];
    this.CardName = json["CardName"];
    this.VATRegNum = json["VATRegNum"];
    this.DocDate = json["DocDate"].split("T")[0];
    this.Reference1 = json["Reference1"];
    this.Series = json["Series"];
    this.DocCurrency = json["DocCurrency"];
    this.ContactPersonCode = json["ContactPersonCode"];
    this.DiscountPercent = json["DiscountPercent"];
    this.Address = json["Address"];
    this.AttachmentEntry = json["AttachmentEntry"];
    this.JournalRemarks = json["JournalRemarks"];
    this.TaxDate = json["TaxDate"].split("T")[0];
    this.DueDate = json["DueDate"].split("T")[0];
    this.DocRate = json["DocRate"];
    this.PaymentInvoices = json["PaymentInvoices"];
    this.CashSum = json["CashSum"];
    this.TransferSum = json["TransferSum"];
    this.CashAccount = json["CashAccount"];
    this.PaymentChecks = json["PaymentChecks"];
    this.PayToCode = json["PayToCode"];
    this.PaymentAccounts = json["PaymentAccounts"];
  }

  toJson(update: boolean) {
    throw new Error("Method not implemented.");
  }
}
