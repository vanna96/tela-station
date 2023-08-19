import { } from '../utilies';
import Model, { LineDocumentModel, MasterDocumentModel } from './Model';
import { MasterDocument, DocumentLine } from './interface/index';
import moment from 'moment';
import { ContactEmployee } from './BusinessParter';
import GLAccountRepository from '@/services/actions/GLAccountRepository';
import { isItemType } from '@/constants';

export default class PurchaseDownPayment extends MasterDocumentModel {
  DocEntry: any;
  DocNum: any;
  Id: any;
  SalesPersonCode?: number
  CardCode?: string;
  CardName?: string;
  DocDate?: string;
  DocDueDate?: string;
  TerminateDate?: string;
  Description?: string;
  Status?: string;
  DocumentsOwner?: string;
  Remark?: string;
  AttachmentEntry?: number;
  PaymentGroupCode?: string;
  PriceList?: number;
  Series: string;
  PaymentMethod: string | null = null;
  ShippingType: string | null = null;
  JournalMemo?: string;
  Items: PurchaseDownPaymentDocumentLine[];
  TaxDate: string;
  Comments: string;
  DocType: string;
  Address: string;
  ContactPersonList?: ContactEmployee[];
  Address2: string;
  ExtraMonth: string;
  ExtraDays: string;
  CashDiscountDateOffset: number;
  CreateQRCodeFrom: string;
  CancelDate: string;
  Indicator: number;
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
  NumberOfInstallments?: string;
  DownPaymentType?: string
  AccountCode?: string | undefined;
  AccountName?: string | undefined;
  constructor(json: any) {
    super();
    this.Id = json['DocEntry']
    this.NumberOfInstallments = json['NumberOfInstallments']
    this.SalesPersonCode = json['SalesPersonCode']
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
    this.TerminateDate = (json['TernimatedDate']);
    this.Description = json['Description'];
    this.ShippingType = json['TransportationCode'];
    this.PaymentGroupCode = json['PaymentGroupCode'];
    this.TaxDate = (json['TaxDate']);
    this.Comments = json['Comments'];
    this.Address = json['Address'];
    this.Address2 = json['Address2'];
    this.CashDiscountDateOffset = json['CashDiscountDateOffset'];
    this.Items = (json['DocumentLines'] ?? json['Items'])?.map((e: any) => new PurchaseDownPaymentDocumentLine(e));
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
    this.DownPaymentType = json['DownPaymentType']
    this.AccountCode = json['AccountCode'];
    this.AccountName = json['AccountName'];
  }
  setItem(items: any[]) {
    this.Items = items;
  }
  toJson(update = false) {
    return {
      "DownPaymentType": "dptRequest",
      "NumberOfInstallments": this.NumberOfInstallments,
      "SalesPersonCode": this.SalesPersonCode,
      "VatSum": this.VatSum,
      "NumAtCard": this.NumAtCard,
      "DocumentsOwner": this.DocumentsOwner,
      "DocumentStatus": update ? null : this.DocumentStatus,
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
      "DocType":  this.DocType,
      "Address": this.Address,
      "Address2": this.Address2,
      "ContactPersonCode": this.ContactPersonCode,
      "DocDate": update ? null : this.DocDate,
      "DocDueDate": this.DocDueDate,
      // "RequriedDate": json['requriedDate'],
      "TerminateDate": this.TerminateDate,
      "Description": this.Description,
      "Status": update ? null : this.DocumentStatus,
      "Owner": this.DocumentsOwner,
      "Remarks": this.Remark,
      "AttachmentEntry": this.AttachmentEntry,
      "PaymentGroupCode": this.PaymentGroupCode,
      // "Series": update ? null : this.Series,
      "PaymentMethod": this.PaymentMethod,
      "TransportationCode": this.TransportationCode,
      "Project": this.Project,
      "DocCurrency": this.Currency,
      "TaxDate": this.TaxDate,
      "CreateQRCodeFrom": this.CreateQRCodeFrom,
      "DocumentLines": this.Items?.map((e) => e.toJson(this.DocType, update))
    };
  }


}



export class PurchaseDownPaymentDocumentLine extends LineDocumentModel {
  ItemCode?: string;
  ItemDescription?: string | undefined;
  Quantity?: number | undefined;
  UnitPrice?: number | undefined;
  Currency?: string | undefined;
  LineDiscount?: number;
  UomEntry?: number | undefined;
  UomCode?: string | undefined;
  TransportationCode?: string | undefined;
  Troject?: string | undefined;
  TaxCode?: string | undefined;
  TaxRate?: number | undefined;
  VatGroup?: string | undefined;
  LineTotal?: string | undefined;
  RequiredDate?: string | undefined
  ShipDate?: string | undefined;
  AccountCode?: string | undefined;
  AccountName?: string | undefined;
  BlanketAgreementNumber?: string | undefined;
  DiscountPercent?: number;
  RequriedDate?: string;
  ItemName?: string;
  SaleVatGroup?: string;
  Project?: String;
  UomGroupEntry?: number | undefined;
  UomGroupName?: number | undefined;
  UnitsOfMeasurement?: string

  constructor(json: any) {
    super();
    this.SaleVatGroup = json['VatGroup'];
    this.ItemCode = json['ItemCode'];
    this.ItemDescription = json['ItemDescription'];
    this.Quantity = json['Quantity'];
    this.UnitPrice = json['UnitPrice'];
    this.Currency = json['PriceCurrency'];
    this.LineDiscount = json['LineDiscount'];
    this.UomEntry = json['UoMEntry'];
    this.UomCode = json['UoMCode'];
    this.Project = json['Project'];
    this.VatGroup = json['VatGroup'];
    this.DiscountPercent = json['DiscountPercent'];
    this.ShipDate = (json['ShipDate']);
    this.AccountCode = json['AccountCode'];
    this.AccountName = json['AccountName'];
    this.LineTotal = json['LineTotal'];
    this.ItemName = json['ItemDescription'];
    this.BlanketAgreementNumber = json['BlanketAgreementNumber'];
    this.UnitsOfMeasurement = json['UnitsOfMeasurement']
    this.TaxCode = json['TaxCode'] ?? json['VatGroup'];

  }

  setUOMGroup(uomGroup: any): void {
    this.UomGroupEntry = uomGroup.AbsEntry;
    this.UomGroupName = uomGroup?.Code;
  }
  toJson(type="dDocument_Items", update = false) {
    let line = {
      "Quantity": this.Quantity,
      "ItemCode": this.ItemCode,
      "ItemDescription": this.ItemDescription,
      "ItemName": this.ItemName,
      "UnitPrice": this.UnitPrice,
      "UoMEntry": this.UomEntry,
      "UoMCode": this.UomCode,

      "VatGroup": this.VatGroup,
      "LineTotal": this.LineTotal,
      "RequiredDate": this.RequiredDate,
      "ShipDate": this.ShipDate,
      "AccountCode": null ? 0 : this.AccountCode,
      "AccountName": this.AccountName,
      "BlanketAgreementNumber": this.BlanketAgreementNumber,
      "DiscountPercent": update ? null: this.DiscountPercent,
      "TaxCode": this.TaxCode,

    };

    if (type === "dDocument_Service") {

      delete line.ItemCode;
      delete line.UnitPrice;
      delete line.DiscountPercent;
      delete line.UnitPrice;

      
    }
    return line;
  }


}


