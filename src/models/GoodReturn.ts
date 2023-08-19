import { LineDocumentModel, MasterDocumentModel } from './Model';
import { ContactEmployee } from './BusinessParter';
import { getValueDocumentStatus, getValueDocumentStatusProcument, isItemType } from '@/constants';
import Currency from './Currency';
import { BPAddress } from './BusinessParter';


export default class GoodReturn extends MasterDocumentModel {
  DocEntry: any;
  // Series: string;
  DocNum: any;
  CardCode?: string;
  CardName?: string;
  NumAtCard?: string;
  ContactPersonCode?: number;
  DocDate?: string;
  DocDueDate?: string;
  RequiredDate?: string;
  Description?: string;
  Status?: string;
  DocumentsOwner?: string;
  Remark?: string;
  AttachmentEntry?: number;
  PaymentTermType?: string;
  PriceList?: number;
  PaymentGroupCode?: string;
  // serie: string;

  CashDiscountDateOffset?: number;
  CreateQRCodeFrom?: string;
  TaxDate?: string;
  CancelDate?: string;
  Indicator?: string;
  FederalTaxID?: string;
  ImportFileNum?: string;
  DocCurrency?: string;
  DocumentStatus?: string;
  // DocType?: string;
  TransportationCode?: string;
  SalesPersonCode?: number;
  AccountName?: string;

  JournalMemo?: string | undefined;
  CentralBankIndicator?: string | undefined;
  NumberOfInstallments?: string | undefined;
  StartFrom?: string | undefined;
  Project?: string | undefined;

  ContactPersonList?: ContactEmployee[];
  ShippingList?: BPAddress[];
  Address?: string;
  Address2?: string;
  IsEditable?: boolean;
  Items: GoodReturnDocumentLine[];
  DocType?: string;
  DocumentType?: string;
  Comments?: string;
  DocTotalSys?: number | undefined;
  VatSum?: number | undefined;
  ExtraMonth?: number | undefined;
  ExtraDays?: number | undefined;
  DocStatus?: string | undefined;
  DiscountPercent?: number | undefined;
  TotalDiscount?: number | undefined;
  Rounding?: string | undefined;

  constructor(json: any) {
    super();
    this.DocEntry = json['DocEntry'];
    this.Series = json['Series'];
    this.DocNum = json['DocNum'];
    this.CardCode = json['CardCode'] ?? json['BPCode'];
    this.CardName = json['CardName'] ?? json['BPName'];
    this.NumAtCard = json['NumAtCard'];
    this.DocCurrency = json['DocCurrency'];
    this.ContactPersonCode = json['ContactPersonCode'];
    this.DocDate = json['DocDate'];
    this.DocDueDate = json['DocDueDate'];
    this.TaxDate = json['TaxDate'];
    this.CancelDate = json['CancelDate'];
    this.Description = json['Description'];
    this.DocType = json['DocType'];
    this.DocumentType = json['DocType']
    // this.DocumentStatus = getValueDocumentStatusProcument(json['DocumentStatus']);
    // this.DocumentStatus = (json['DocumentStatus']);
    this.DocumentStatus = json["DocumentStatus"]
    this.DocStatus = (json['DocumentStatus']?.replace("bost_",""));
    this.DocumentsOwner = json['DocumentsOwner'];
    // this.Renewal = json['Renewal'] === 'tYES';
    this.Remark = json['Remarks'];
    this.TransportationCode = json['TransportationCode']
    this.AttachmentEntry = json['AttachmentEntry'];
    this.PaymentTermType = json['PaymentTerms'];
    this.JournalMemo = json['JournalMemo']
    this.CentralBankIndicator = json['CentralBankIndicator']
    this.NumberOfInstallments = json['NumberOfInstallments']
    this.StartFrom = json['StartFrom']?.replace('pdt_', "");
    this.Project = json['Project']
    this.PriceList = json['PriceList'];
    this.PaymentMethod = json['PaymentMethod'];
    this.Address = json['Address'];
    this.Address2 = json['Address2'];
    this.ShippingType = json['ShippingType'];
    this.Indicator = json['Indicator']
    this.FederalTaxID = json['FederalTaxID']
    this.ImportFileNum = json['ImportFileNum']
    this.ContactPersonList = json['contactPersonList'];
    this.ShippingList = json['shippingList'];
    this.DocTotalSys = json['DocTotalSys']
    this.VatSum = json['VatSum']
    this.PaymentGroupCode = json['PaymentGroupCode']
    this.ExtraMonth = json['ExtraMonth']
    this.ExtraDays = json['ExtraDays']
    this.StartFrom = json['StartFrom']
    this.CashDiscountDateOffset = json["CashDiscountDateOffset"]
    this.DiscountPercent = json['DiscountPercent']
    this.TotalDiscount = json['TotalDiscount']
    this.Rounding = json['Rounding']

    this.CreateQRCodeFrom = json['CreateQRCodeFrom']
    this.Comments = json['Comments'];
    this.DocumentsOwner = json['DocumentsOwner']
    this.SalesPersonCode = json['SalesPersonCode']
    this.IsEditable = !json['DocumentStatus']?.replace('dDocument_', "")?.charAt(0)?.includes('O');
    this.Items = (json['DocumentLines'] ?? json['Items'])?.map((e: any) => new GoodReturnDocumentLine(e));
  }

  setItem(items: any[]) {
    this.Items = items;
  }

  toJson(update = false) {
    return {
      "CardCode": this.CardCode,
      "CardName": this.CardName,
      "ContactPersonCode": this.ContactPersonCode,
      "DocDate": this.DocDate,
      "DocDueDate": this.DocDueDate,
      "TaxDate": this.TaxDate,
      "Description": this.Description,
      "DocType": this.DocType,
      "Status": this.Status,
      "DocumentsOwner": this.DocumentsOwner === '' ? null : this.DocumentsOwner,
      // "Renewal": this.Renewal ? 'Y' : 'N',
      "Comments": this.Comments,
      "AttachmentEntry": this.AttachmentEntry === 0 ? null : this.AttachmentEntry,
      "PaymentTerms": this.PaymentTerm,
      // "Series": this.Series,
      // "Series": this.Series,
      "PaymentMethod": this.PaymentMethod,
      "ShippingType": this.ShippingType,
      "NumAtCard": this.NumAtCard,
      "Project": this.Project,
      "BPCurrency": this.DocCurrency,
      "SalesPersonCode": this.SalesPersonCode,
      "DocumentLines": this.Items.map((e) => e.toJson(this.DocType ?? '', update)),
      "TransportationCode": this.TransportationCode,
      "PaymentTermType": this.PaymentTermType,
      "JournalMemo": this.JournalMemo,
      "CentralBankIndicator": this.CentralBankIndicator,
      "NumberOfInstallments": this.NumberOfInstallments,
      "StartFrom": this.StartFrom,
      "PriceList": this.PriceList,
      "Address": this.Address,
      "Address2": this.Address2,
      "Indicator": this.Indicator,
      "FederalTaxID": this.FederalTaxID,
      "ImportFileNum": this.ImportFileNum,
      "CreateQRCodeFrom": this.CreateQRCodeFrom,
      "CancelDate": this.CancelDate,
      "PaymentGroupCode": this.PaymentGroupCode,
      "ExtraMonth" : this.ExtraMonth,
      "ExtraDays" : this.ExtraDays,
      "CashDiscountDateOffset" : this.CashDiscountDateOffset,
      "Rounding" : this.Rounding,
      // "DocTotalSys": this.DocTotalSys,
      // "VatSum": this.VatSum

    };
  }




  public static getType(status: string | null): string {
    switch (status) {
      case 'S':
        return 'Service Method'
      default:
        return 'Items Method';
    }
  }
}

export class GoodReturnDocumentLine extends LineDocumentModel {
  ItemCode?: string | undefined;
  ItemName?: string | undefined;
  ItemGroup?: string | undefined;
  Quantity?: number | undefined;
  UnitPrice?: number | undefined;
  Currency?: string | undefined;
  LineDiscount?: number;
  UomEntry?: number | undefined;
  UomCode?: string | undefined;
  ShippingType?: string | undefined;
  Project?: string | undefined;
  TaxCode?: string | undefined;
  TaxRate?: number | undefined;
  ItemDescription?: string | undefined;
  ItemGroupName?: string | undefined;
  UomGroupEntry?: number | undefined;
  UomGroupName?: number | undefined;
  VatGroup?: string | undefined;
  AccountName?: string | undefined;
  UnitsOfMeasurement: number | undefined;
  ShipDate?: string | undefined;
  RequiredDate?: string | undefined;
  AccountCode?: string | undefined;
  LineTotal?: string | undefined;
  BlanketAgreementNumber?: string | undefined;
  DiscountPercent?: number | undefined;

  constructor(json: any) {
    super();
    this.ItemCode = json['ItemNo'] ?? json['ItemCode'];
    this.ItemName = json['ItemDescription'];
    this.ItemGroup = json['ItemGroup'];
    this.Quantity = json['Quantity'];
    this.UnitPrice = json['UnitPrice'];
    this.Currency = json['PriceCurrency'];
    this.LineDiscount = json['LineDiscount'];
    this.UomEntry = json['UoMEntry'];
    this.UomCode = json['UoMCode'];
    this.ShippingType = json['ShippingType'];
    this.Project = json['Project'];
    this.TaxCode = json['TaxCode'] ?? json['VatGroup'];
    this.TaxRate = json['TAXRate'];
    this.UnitsOfMeasurement = json['UnitsOfMeasurement']
    this.ShipDate = json['ShipDate'];
    this.RequiredDate = json['RequiredDate'];
    this.AccountCode = json['AccountCode'];
    this.AccountName = json['AccountName'];
    this.VatGroup = json['VatGroup'];
    this.LineTotal = json['LineTotal'];
    this.BlanketAgreementNumber = json['BlanketAgreementNumber'];
    this.DiscountPercent = json['DiscountPercent'];
  }

  setUOMGroup(uomGroup: any): void {
    this.UomGroupEntry = uomGroup.AbsEntry;
    this.UomGroupName = uomGroup?.Code;
  }

  setItemGroup(itemGroup: any): void {
    //   this.itemGroup = itemGroup.
  }

  toJson(type: string, update = false) {
    let body = {
      "ItemCode": this.ItemCode,
      "ItemDescription": this.ItemName,
      "ItemGroup": this.ItemGroup,
      "Quantity": this.Quantity,
      "UnitPrice": this.UnitPrice,
      "UoMEntry": this.UomEntry,
      "UoMCode": this.UomCode,
      // "UnitsOfMeasurement": 0,
      // "FreeText": this ?? null,
      "LineDiscount": this.LineDiscount,
      "ShippingType": this.ShippingType,
      // "Project": this.Project,
      "TaxCode": update ? null : this.TaxCode,
      // "TAXRate": null,
      "ShipDate": this.ShipDate,
      "RequiredDate": this.RequiredDate,
      "AccountCode": this.AccountCode,
      "AccountName": null,
      "VatGroup": this.VatGroup,
      "LineTotal": this.LineTotal,
      "Total": null,
      "BlanketAgreementNumber": this.BlanketAgreementNumber,
      "DiscountPercent": this.DiscountPercent

    };

    if (!isItemType(type)) {
      delete body.ItemCode;
      delete body.ItemDescription;
      delete body.ItemGroup;
      delete body.UnitPrice;
      delete body.UoMEntry;
    }

    return body;
  }
}

