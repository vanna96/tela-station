import { } from '../utilies';
import Model, { LineDocumentModel, MasterDocumentModel } from './Model';
import { MasterDocument, DocumentLine } from './interface/index';
import moment from 'moment';
import { ContactEmployee } from './BusinessParter';
import GLAccountRepository from '@/services/actions/GLAccountRepository';
import Currency from './Currency';
import { isItemType } from '@/constants';
import shortid from 'shortid';

export default class PurchaseQouatation extends MasterDocumentModel {
  id: any;
  DocEntry: any;
  DocNum: any;
  SalesPersonCode?: number
  CardCode?: string;
  CardName?: string;
  DocDate?: string;
  DocDueDate?: string;
  RequriedDate?: string
  TernimatedDate?: string;
  Description?: string;
  Status?: string;
  DocumentsOwner?: string;
  Remark?: string;
  AttachmentEntry?: number;
  PaymentGroupCode?: string;
  PriceList?: number;
  Series: string;
  PaymentMethod: string | null = null;
  PaymentTerm: string | null = null;
  JournalMemo?: string;
  Items: PurchaseQoutationDocumentLine[];
  TaxDate: string;
  Comments: string;
  DocType?: string | undefined;
  Address: string;
  ContactPersonList?: ContactEmployee[];
  Address2: string;
  ExtraMonth: string;
  ExtraDays: string;
  CashDiscountDateOffset: number;
  CreateQRCodeFrom: string;
  CancelDate: string;
  Indicator: string;
  FederalTaxID: string;
  ImportFileNum: string;
  Currency: string;
  DocumentStatus: string;
  Project: string;
  DiscountPercent?: string;
  ItemName?: string;
  UomCode?: string;
  TransportationCode?: string;
  ContactPersonCode?: number;
  NumAtCard?: string;
  VatSum?: number;
  DocTotalSys?: number;
  AccountNameD?: string;
  UnitsOfMeasurement: number | undefined;
  constructor(json: any) {
    super();
    this.id = json['DocEntry'];
    this.SalesPersonCode = json['SalesPersonCode'];
    this.UnitsOfMeasurement = json[' UnitsOfMeasurement'];
    this.DocEntry = json['DocEntry'];
    this.DocTotalSys = json['DocTotalSys']
    this.VatSum = json['VatSum'];
    this.NumAtCard = json['NumAtCard']
    this.DocumentStatus = json['DocumentStatus'];
    this.FederalTaxID = json['FederalTaxID']
    this.ExtraMonth = json['ExtraMonth'];
    this.ExtraDays = json['ExtraDays'];
    this.Series = json['Series'];
    this.DocType = json['DocType'];
    this.DocNum = json['DocNum'];
    this.ContactPersonList = json['ContactPersonList'];
    this.JournalMemo = json['JournalMemo']
    this.CardName = json['CardName'];
    this.CardCode = json['CardCode'];
    this.DocumentsOwner = json['DocumentsOwner'];
    this.CardCode = json['CardCode'];
    this.ContactPersonCode = json['ContactPersonCode'];
    this.DocDate = (json['DocDate']);
    this.DocDueDate = (json['DocDueDate']);
    this.TernimatedDate = (json['TernimatedDate']);
    this.Description = json['Description'];
    this.ShippingType = json['TransportationCode'];
    this.PaymentGroupCode = json['PaymentGroupCode'];
    this.TaxDate = (json['TaxDate']);
    this.RequriedDate = (json['RequriedDate']);
    this.Comments = json['Comments'];
    this.Address = json['Address'];
    this.Address2 = json['Address2'];
    this.CashDiscountDateOffset = json['CashDiscountDateOffset'];
    this.Items = (json['DocumentLines'] ?? json['Items'])?.map((e: any) => new PurchaseQoutationDocumentLine(e));
    this.CreateQRCodeFrom = json['CreateQRCodeFrom'];
    this.CancelDate = json['CancelDate'];
    this.Indicator = json['Indicator'];
    this.ImportFileNum = json['ImportFileNum'];
    this.PaymentMethod = json['PaymentMethod'];
    this.Currency = json['DocCurrency'];
    this.Project = json['Project'];
    this.DiscountPercent = json['DiscountPercent'];
    this.ItemName = json['ItemDescription'];
    this.UomCode = json['UoMCode'];
    this.TransportationCode = json['TransportationCode'];
    this.AccountNameD = new GLAccountRepository().find(json["AccountCode"])?.Name

  }
  setItem(items: any[]) {
    this.Items = items;
  }
  toJson(update = false) {
    const json: any = {
      "UoMCode": this.UomCode,
      "SalesPersonCode": this.SalesPersonCode,
      "VatSum": this.VatSum,
      // "UnitsOfMeasurement": this.UnitsOfMeasurement,
      "NumAtCard": this.NumAtCard,
      "DocumentsOwner": this.DocumentsOwner,
      "DocumentStatus": this.DocumentStatus,
      "ImportFileNum": this.ImportFileNum,
      "FederalTaxID": this.FederalTaxID,
      "Indicator": this.Indicator,
      "CancelDate": this.CancelDate,
      "CashDiscountDateOffset": this.CashDiscountDateOffset,
      "ExtraMonth": this.ExtraMonth,
      "ExtraDays": this.ExtraDays,
      "JournalMemo": this.JournalMemo,
      "CardCode": this.CardCode,
      "CardName": this.CardName,
      "Comments": this.Comments,
      "DocType": this.DocType,
      "Address": this.Address,
      "Address2": this.Address2,
      "ContactPersonCode": this.ContactPersonCode,
      "DocDate": this.DocDate,
      "DocDueDate": this.DocDueDate,
      "RequriedDate": this.RequriedDate,
      "TerminateDate": this.TernimatedDate,
      "Description": this.Description,
      "Status": this.Status,
      "Remarks": this.Remark,
      "AttachmentEntry": this.AttachmentEntry,
      "PaymentGroupCode": this.PaymentGroupCode,
      "Series": this.Series,
      "PaymentMethod": this.PaymentMethod,
      "TransportationCode": this.TransportationCode,
      "Project": this.Project,
      "DocCurrency": this.Currency,
      "TaxDate": this.TaxDate,
      "CreateQRCodeFrom": this.CreateQRCodeFrom,
      "DocumentLines": this.Items?.map((e) => e.toJson(this.DocType ?? '', update))
    };

  
    if (update) {
      delete json.Series;
      delete json.CardCode;
      delete json.CardName;
    }

    return json;
  }

}



export class PurchaseQoutationDocumentLine extends LineDocumentModel {
  ItemCode?: string | undefined;
  ItemDescription?: string | undefined;
  Quantity?: number | undefined;
  UnitPrice?: number | undefined;
  Urrency?: string | undefined;
  LineDiscount?: number;
  UomEntry?: number | undefined;
  UomCode?: string | undefined;
  TransportationCode?: string | undefined;
  Project?: string | undefined;
  TaxCode?: string | undefined;
  TaxRate?: number | undefined;
  VatGroup?: string | undefined;
  LineTotal?: string | undefined;
  RequiredDate?: string | undefined
  ShipDate?: string | undefined;
  AccountCode?: number | undefined;
  AccountName?: string | undefined;
  BlanketAgreementNumber?: string | undefined;
  DiscountPercent?: number;
  RequriedDate?: string;
  ItemName?: string;
  SaleVatGroup?: string;
  Currency?: String;
  UomGroupEntry?: number | undefined;
  UomGroupName?: number | undefined;
  RequiredQuantity?: number;

  constructor(json: any) {
    super();
    this.SaleVatGroup = json['VatGroup'];
    this.ItemCode = json['ItemCode'] ?? shortid.generate();
    this.ItemDescription = json['ItemDescription'] ?? json['ItemName'];
    this.Quantity = json['Quantity'];
    this.UnitPrice = json['UnitPrice'];
    this.Currency = json['PriceCurrency'];
    this.LineDiscount = json['LineDiscount'];
    this.UomEntry = json['UoMEntry'];
    this.UomCode = json['UoMCode'];
    this.Project = json['Project'];
    this.VatGroup = json['VatGroup'];
    this.RequriedDate = (json['RequriedDate']);
    this.DiscountPercent = json['DiscountPercent'];
    this.ShipDate = (json['ShipDate']);
    this.AccountCode = json['AccountCode'];
    this.AccountName = json['AccountName'];
    this.LineTotal = json['LineTotal'];
    this.ItemName = json['ItemDescription'] ?? json['ItemName'];
    this.BlanketAgreementNumber = json['BlanketAgreementNumber'];
    this.TaxCode = json['TaxCode'] ?? json['VatGroup'];
    this.RequiredQuantity = json['RequiredQuantity'];
    this.RequiredDate = json['RequiredDate'];
  }

  setUOMGroup(uomGroup: any): void {
    this.UomGroupEntry = uomGroup.AbsEntry;
    this.UomGroupName = uomGroup?.Code;
  }
  toJson(type = "dDocument_Items", update = false) {
    let body = {
      "VatGroup": this.SaleVatGroup,
      "ItemCode": this.ItemCode,
      "ItemDescription": this.ItemDescription,
      "Quantity": this.Quantity,
      "UnitPrice": this.UnitPrice,
      "PriceCurrency": this.Currency,
      "LineDiscount": this.LineDiscount,
      "UoMEntry": this.UomEntry,
      "UoMCode": this.UomCode,
      "Project": this.Project,
      "RequriedDate": this.RequiredDate,
      "DiscountPercent": update ? null : this.DiscountPercent,
      "ShipDate": this.ShipDate,
      "AccountCode": this.AccountCode,
      "AccountName": this.AccountName,
      "LineTotal": this.LineTotal,
      "BlanketAgreementNumber": this.BlanketAgreementNumber,
      "TaxCode": update ? null : this.TaxCode,
      "RequiredQuantity": this.RequiredQuantity,
      "RequiredDate": this.RequiredDate,
    }
    if (type === 'dDocument_Service') {
      delete body.DiscountPercent;
      delete body.ItemCode;
      delete body.UnitPrice;
      delete body.LineDiscount;
      delete body.Project
    }

    return body;
  }



}


