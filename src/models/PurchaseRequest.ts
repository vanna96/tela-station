import shortid from "shortid";
import { LineDocumentModel, MasterDocumentModel } from "./Model";
import { isItemType } from "@/constants";
import GLAccountRepository from "@/services/actions/GLAccountRepository";


export default class PurchaseRequest extends MasterDocumentModel {
  Series: string;
  DocEntry: any;
  DocNum: number;
  CardCode: string;
  CardName?: string;
  RequesterEmail?: string;
  RequesterBranch?: string;
  RequesterDepartment?: string;
  ReqType?: string;
  ReqCode?: string;
  InventoryStatus?: string;
  DocType: string;
  DocDate: string;
  DocDueDate?: string;
  AttachmentEntry?: number;
  DocCurrency?: string;
  DocRate?: string;
  Reference1?: string;
  Reference2?: string;
  Comments?: string;
  JournalMemo?: string;
  PaymentGroupCode?: string;
  SalesPersonCode?: string;
  TransportationCode?: string;
  Confirmed?: string;
  ContactPersonCode?: string;
  TaxDate?: string;
  PartialSupply?: string;
  DocObjectCode?: string;
  Indicator?: string;
  FederalTaxID?: string;
  DiscountPercent?: string;
  CreationDate?: string;
  RequriedDate?: string;
  UpdateDate?: string;
  UserSign?: string;
  VatSum?: string;
  DocTotalSys?: string;
  CancelDate?: string;
  Rounding?: string;
  Address2?: string;
  DocumentStatus?: string;
  PeriodIndicator?: string;
  PayToCode?: string;
  ManualNumber?: string;
  UseShpdGoodsAct?: string;
  TotalDiscount?: string;
  VatPercent?: string;
  ExtraMonth?: string;
  ExtraDays?: string;
  StartFrom?: string;
  DownPaymentStatus?: string;
  BPLName?: string;
  VATRegNum?: string;
  PaymentTerm: string;
  PaymentMethod: string;
  ShippingType: string;
  Items: PurchaseRequestDocumentLine[];
  Documentowner?: string;
  VatSumSys?: string;
  Price?: number;
  UserCode?: string;
  UserName?: string;
  Department?: string;
  Branch?: string;
  Status?: string;
  Email?: string;
  Owner?: string;
  Printed: boolean;
  DocumentLine?: PurchaseRequestDocumentLine[];

  constructor(json: any) {
    super();
    this.DocEntry = json["DocEntry"];
    this.DocNum = json["DocNum"];
    this.ReqType = json["ReqType"];
    this.Department = json["Department"];
    this.Branch = json["Branch"];
    this.CardCode = json['CardCode'] ?? json['Requester'];
    this.CardName = json['CardName'] ?? json['RequesterName'];
    this.RequesterEmail = json["RequesterEmail"] ?? json["Email"];
    this.RequesterDepartment = json["RequesterDepartment"] ?? json["Department"];
    this.RequesterBranch = json["RequesterBranch"] ?? json["Branch"];
    this.Series = json["Series"];
    this.DocTotalSys = json["DocTotalSys"];
    this.Owner = json['Owner'] ?? json["DocumentsOwner"];
    this.Status = json["DocumentStatus"];
    this.VatSumSys = json["VatSumSys"];
    this.Price = json["Price"];
    this.DocNum = json["DocNum"];
    this.RequriedDate = json["RequriedDate"];
    this.TaxDate = json["TaxDate"];
    this.DocDueDate = json["DocDueDate"];
    this.DocDate = json["DocDate"];
    this.DocType = json["DocType"];
    this.Comments = json["Comments"];
    this.UserCode = json["Requester"];
    this.UserName = json["RequesterName"];
    this.Department = json["RequesterDepartment"];
    this.Branch = json["RequesterBranch"];
    this.DocumentStatus = json["DocumentStatus"].replace("bost_", "");
    this.ReqType = json["ReqType"];
    this.PaymentTerm = json['PaymentGroupCode']
    this.PaymentMethod = json['PaymentMethod']
    this.ShippingType = json['TransportationCode']
    this.DocTotalSys = json['DocTotalSys'] ?? 0;
    this.Printed = json['Printed'] === "psYes";
    this.Items = (json["DocumentLines"] ?? json['Items'])?.map((e: any) => new PurchaseRequestDocumentLine(e));
  }

  setItem(items: any[]) {
    throw new Error("Method not implemented.");
  }

  toJson(update = false) {
    return {
      Series: this.Series,
      Requester: this.CardCode,
      RequesterName: this.CardName,
      RequesterEmail: this.RequesterEmail,
      RequesterBranch: this.RequesterBranch,
      RequesterDepartment: this.RequesterDepartment,
      ReqType: this.ReqType,
      DocType: this.DocType,
      TaxDate: this.TaxDate,
      DocDate: this.DocDate,
      RequriedDate: this.RequriedDate,
      DocDueDate: this.DocDueDate,
      DocumentOwner: this.Owner,
      AttachmentEntry: this.AttachmentEntry,
      DocCurrency: this.DocCurrency,
      DocRate: this.DocRate,
      Comments: this.Comments,
      // DocTotalSys: this.DocTotalSys,
      DiscountPercent: this.DiscountPercent,
      Rounding: this.Rounding,
      Address2: this.Address2,
      DocumentStatus: this.DocumentStatus,
      DocumentLines: this.Items?.map((e: any) => e.toJson(this.DocType, update)),
    };
  }
}


export class PurchaseRequestDocumentLine extends LineDocumentModel {
  ItemCode: string | undefined;
  ItemName: string | undefined;
  ItemGroup: string | undefined;
  Quantity: number | undefined;
  UnitPrice: number | undefined;
  Currency: string | undefined;
  LineDiscount: number;
  UomEntry: number | undefined;
  UomCode: string | undefined;
  TransportationCode: string | undefined;
  Project: string | undefined;
  TaxCode: string | undefined;
  TaxRate: number | undefined;
  VatGroup: string | undefined;
  LineTotal: string | undefined;
  RequiredDate: string | undefined;
  ShipDate: string | undefined;
  AccountCode: number | undefined;
  AccountNo: number | undefined;
  AccountName: string | undefined;
  BlanketAgreementNumber: string | undefined;
  DiscountPercent: number;
  LineVendor: string;
  VatRate: number;
  PriceAfterVAT: number;


  constructor(json: any) {
    super();
    this.ItemCode = json["ItemCode"] ?? shortid.generate();
    this.ItemName = json["ItemName"] ?? json["ItemDescription"];
    this.ItemGroup = json["ItemGroup"];
    this.Quantity = json["Quantity"];
    this.UnitPrice = json["UnitPrice"];
    this.LineDiscount = json["LineDiscount"];
    this.UomEntry = json["UomEntry"] ?? json["UoMEntry"];
    this.UomCode = json["UomCode"] ?? json["UoMCode"];
    this.VatGroup = json["VatGroup"];
    this.RequiredDate = json["RequiredDate"];
    this.DiscountPercent = json["DiscountPercent"];
    this.ShipDate = json["ShipDate"];
    this.AccountCode = json["AccountCode"];
    this.AccountNo = json["AccountNo"] ?? json["AccountCode"];
    this.AccountName = new GLAccountRepository().find(json["AccountCode"])?.Name
    this.LineTotal = json["LineTotal"];
    this.LineVendor = json["LineVendor"];
    this.TaxRate = json["Rate"];
    this.VatRate = json["TaxPercentagePerRow"];
    this.PriceAfterVAT = json['PriceAfterVAT'];
  }


  toJson(type: string, update: boolean): any {
    let line: any = {
      Quantity: this.Quantity,
      ItemCode: this.ItemCode,
      ItemDescription: this.ItemName,
      UnitPrice: this.UnitPrice,
      LineDiscount: 0.0,
      UoMCode: this.UomCode,
      TransportationCode: this.TransportationCode,
      // Project: null,
      // TaxCode: null,
      // TAXRate: null,
      // UoMEntry: this.UoMEntry,
      // VatGroup: this.vatGroup,
      VatGroup: this.VatGroup,
      LineVendor: this.LineVendor,
      RequiredDate: this.RequiredDate,
      AccountCode: this.AccountNo,
      // AccountName: this.AccountName,
      DiscountPercent: this.DiscountPercent,
    };

    if (!isItemType(type)) {
      delete line.ItemCode;
      // delete line.UnitPrice;
      line['LineTotal'] = line.UnitPrice;
    }

    return line;
  }


}
