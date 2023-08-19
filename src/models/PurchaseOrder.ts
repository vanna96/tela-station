import GLAccountRepository from '@/services/actions/GLAccountRepository';
import { dateFormat } from '../utilies';
import { ContactEmployee } from './BusinessParter';
import Model from './Model';
import { MasterDocument, DocumentLine } from './interface/index';
import moment from 'moment';

export interface PurchaseOrderProps {
  id: any;
  docNum: any;
  cardCode?: string;
  cardName?: string;
  contactPersonCode?: number;
  docDate?: string;
  vatSum?: number;
  docDueDate?: string;
  requriedDate?: string
  terminateDate?: string;
  description?: string;
  status?: string;
  documentsOwner?: string;
  docTotalSys?: number;
  remark?: string;
  attachmentEntry?: number;
  paymentGroupCode?: string;
  priceList?: number;
  serie: string;
  paymentMethod?: string;
  journalMemo?: string;
  taxDate: string;
  comments: string;
  docType: string;
  address: string;
  address2: string;
  extraMonth: string;
  extraDays: string;
  cashDiscountDateOffset: number;
  createQRCodeFrom: string;
  transportationCode?: string;
  cancelDate: string;
  indicator: string;
  federalTaxID: string;
  importFileNum: string;
  docCurrency: string;
  documentStatus: string;
  numAtCard?: string;
  uomCode?: string;
  salesPersonCode?: number;
  contactPersonList?: ContactEmployee[];
  documentLine: PurchaseOrderDocumentLineProps[];
  requiredDate: string
}

export interface PurchaseOrderDocumentLineProps {
  itemCode?: string | undefined;
  itemDescription?: string | undefined;
  quantity?: number | undefined;
  unitPrice?: number | undefined;
  currency?: string | undefined;
  lineDiscount?: number;
  uomEntry?: number | undefined;
  uomCode?: string | undefined;
  transportationCode?: string | undefined;
  project?: string | undefined;
  address2?: string | undefined;
  taxCode?: string | undefined;
  taxRate?: number | undefined;
  vatGroup?: string | undefined;
  lineTotal?: string | undefined;
  requiredDate?: string | undefined
  shipDate?: string | undefined;
  accountCode?: string | undefined;
  accountName?: string | undefined;
  blanketAgreementNumber?: string | undefined
  discountPercent?:string
}
export default class PurchaseOrders extends Model implements MasterDocument {
  id: any;
  docNum: any;
  cardCode?: string;
  cardName?: string;
  contactPersonCode?: number;
  docDate?: string;
  docDueDate?: string;
  requriedDate?: string
  terminateDate?: string;
  docTotalSys?: number;
  description?: string;
  contactPersonList?: ContactEmployee[];
  vatSum?: number;
  status?: string;
  documentsOwner?: string;
  remark?: string;
  transportationCode?: string;
  attachmentEntry?: number;
  paymentGroupCode?: string;
  priceList?: number;
  serie: string;
  paymentMethod?: string;
  shippingType?: string | undefined;
  journalMemo?: string;
  items: PurchaseOrderDocumentLineProps[];
  taxDate: string;
  comments: string;
  salesPersonCode?: number;
  docType: string;
  address: string;
  address2: string;
  extraMonth: string;
  extraDays: string;
  cashDiscountDateOffset: number;
  createQRCodeFrom: string;
  numAtCard?: string;
  cancelDate: string;
  indicator: string;
  federalTaxID: string;
  importFileNum: string;
  docCurrency: string;
  documentStatus: string;
  uomCode?: string;
  project: string;
  constructor(json: any) {
    super();
    this.id = json['DocEntry'];
    this.documentStatus = json['DocumentStatus'];
    this.federalTaxID = json['FederalTaxID']
    this.extraMonth = json['ExtraMonth'];
    this.extraDays = json['ExtraDays'];
    this.serie = json['Series'];
    this.docType = json['DocType'] === "dDocument_Service" ? "S" : "I";    
    this.docNum = json['DocNum'];
    this.uomCode = json['UoMCode'];
    this.vatSum = json['VatSum'];
    this.journalMemo = json['JournalMemo']
    this.cardName = json['CardName'];
    this.contactPersonList = json['contactPersonList'];
    this.cardCode = json['CardCode'];
    this.docTotalSys = json['DocTotalSys'];
    this.documentsOwner = json['DocumentsOwner'];
    this.numAtCard = json['NumAtCard'];
    this.salesPersonCode = json['SalesPersonCode'];
    this.contactPersonCode= json['ContactPersonCode'];
    this.description = json['Description'];
    this.docDate = json['DocDate'];
    this.docDueDate = json['DocDueDate'];
    this.transportationCode = json['TransportationCode'];
    this.paymentGroupCode= json['PaymentGroupCode'];
    this.taxDate = json['TaxDate'];
    this.comments = json['Comments'];
    this.address = json['Address'];
    this.address2 = json['Address2'];
    this.cashDiscountDateOffset = json['CashDiscountDateOffset'];
    this.items = json['DocumentLines']?.map((e: any) => new PurchaseOrderDocumentLineProps(e));
    this.createQRCodeFrom = json['CreateQRCodeFrom'];
    this.cancelDate = json['CancelDate'];
    this.indicator = json['Indicator'];
    this.importFileNum = json['ImportFileNum'];
    this.paymentMethod = json['PaymentMethod'];
    this.docCurrency = json['DocCurrency'];
    this.project = json['Project']
  }
  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

  public static toCreate(json: any) {
    console.log(json)

    return {
      "DocumentStatus": json['documentStatus'],
      "ImportFileNum": json['importFileNum'],
      "FederalTaxID": json['federalTaxID'],
      "Indicator": json['indicator'],
      "CancelDate": json['cancelDate'],
      "SalesPersonCode": json['salesPersonCode'],
      "DocTotalSys": json['docTotalSys'],
      "CashDiscountDateOffset": json['cashDiscountDateOffset'],
      "ExtraMonth": json['extraMonth'],
      "ExtraDays": json['extraDay'],
      "JournalMemo": json['journalMemo'],
      "VatSum": json['vatSum'],
      "CardCode": json['cardCode'],
      "CardName": json['cardName'],
      "NumAtCard": json['numAtCard'],
      "Comments": json['comments'],
      "DocType": json['docType'],
      "Address": json['address'],
      "Address2": json['address2'],
      "ContactPersonCode": json['contactPersonCode'],
      "DocDate": json['docDate'],
      "DocDueDate": json['docDueDate'],
      "RequriedDate": json['requriedDate'],
      "TerminateDate": json['terminateDate'],
      "Description": json['description'],
      "Status": json['status'],
      "DocumentsOwner": json['documentsOwner'],
      "Remarks": json['remarks'],
      "UoMcode": json['uomCode'],
      "AttachmentEntry": json['attachmentEntry'],
      "PaymentGroupCode":  json['paymentGroupCode'],
      "Series": json['series'],
      "PaymentMethod": json['paymentMethod'],
      "TransportationCode": json['transportationCode'],
      "Project": json['project'],
      "DocNum": json['docNum'],
      "DocCurrency": json['docCurrency'],
      "TaxDate": json['taxDate'],
      "CreateQRCodeFrom": json['createQRCodeFrom'],
      "DocumentLines": json['items'].map((e: any) => PurchaseOrderDocumentLineProps.toCreate(e, json['docType']))
    };
  }


  public static toUpdate(json: any) {
    return {
      "DocumentStatus": json['documentStatus'],
      "ImportFileNum": json['importFileNum'],
      "FederalTaxID": json['federalTaxID'],
      "Indicator": json['indicator'],
      "CancelDate": json['cancelDate'],
      "CashDiscountDateOffset": json['cashDiscountDateOffset'],
      "JournalMemo": json['journalMemo'],
      "Address": json['address'],
      "Address2": json['address2'],
      "NumAtCard": json['numAtCard'],
      "VatSum": json['vatSum'],
      "UoMCode": json['uomCode'],
      "SalesPersonCode": json['salesPersonCode'],
      "DocType": json['docType'],
      "DocTotalSys": json['docTotalSys'],
      "Comments": json['comments'],
      "RequriedDate": json['requriedDate'],
      "TaxDate": json['taxDate'],
      "CardCode": json['cardCode'],
      "CardName": json['cardName'],
      "ContactPersonCode": json['contactPersonCode'],
      "DocDate": json['docDate'],
      "DocDueDate": json['docDueDate'],
      "TerminateDate": json['terminateDate'],
      "Description": json['description'],
      "Status": json['status'],
      "DocumentsOwner": json['documentsOwner'],
      "Remarks": json['remarks'],
      "AttachmentEntry": json['attachmentEntry'],
      "PaymentGroupCode":  json['paymentGroupCode'],
      "Series": json['series'],
      "DocNum": json['docNum'],
      "PaymentMethod": json['paymentMethod'],
      "TransportationCode": json['transportationCode'],
      "Project": json['project'],
      "DocCurrency": json['docCurrency'],
      "CreateQRCodeFrom": json['createQRCodeFrom'],
      "DocumentLines": json['items'].map((e: any) => PurchaseOrderDocumentLineProps.toCreate(e, json['docType']))
    };
  }


}

export class PurchaseOrderDocumentLineProps extends Model implements DocumentLine {
  itemCode?: string | undefined;
  itemDescription?: string | undefined;
  quantity?: number | undefined;
  unitPrice?: number | undefined;
  currency?: string | undefined;
  address?: string | undefined;
  address2?: string | undefined;
  lineDiscount?: number;
  uomEntry?: number | undefined;
  uomCode?: string | undefined;
  transportationCode?: string | undefined;
  project?: string | undefined;
  taxCode?: string | undefined;
  taxRate?: number | undefined;
  vatGroup?: string | undefined;
  lineTotal?: string | undefined;
  requiredDate?: string | undefined
  shipDate?: string | undefined;
  accountCode?: string | undefined;
  accountName?: string | undefined;
  blanketAgreementNumber?: string | undefined;
  discountPercent?: string;
  requriedDate?: string;
  accountNameD: string;

  constructor(json: any) {
    super();
    this.itemCode = json['ItemCode'];
    this.itemDescription = json['ItemDescription'];
    this.quantity = json['Quantity'];
    this.unitPrice = json['UnitPrice'];
    this.currency = json['PriceCurrency'];
    this.lineDiscount = json['LineDiscount'];
    // this.uomEntry = json['UoMEntry'];
    this.uomCode = json['UoMCode'];
    this.project = json['Project'];
    this.vatGroup = json['VatGroup'];
    this.address = json['Address'];
    this.address2 = json['Address2'];
    this.discountPercent = json['DiscountPercent'];
    this.accountCode = json['AccountCode'];
    this.accountName = json['AccountName'];
    this.lineTotal = json['LineTotal'];
    this.blanketAgreementNumber = json['BlanketAgreementNumber']
    this.accountNameD = new GLAccountRepository().find(json["AccountCode"])?.Name

  }
  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }

  public static toCreate(json: any, type: any) {

    let line = {
      "ItemCode": json["itemCode"],
      "ItemDescription": json['itemDescription'],
      "UnitPrice": json['unitPrice'],
      "Quantity": json['quantity'],
      "LineDiscount": 0.0,
      "DocEntry": json['uomGroupEntry'],
      "UoMCode": json["uomCode"],
      "TransportationCode": 1,
      "Project": null,
      "TaxCode": null,
      "TAXRate": null,
      "VatGroup": json["vatGroup"],
      "LineTotal": json["lineTotal"],
      "RequiredDate": json["requiredDate"],
      "ShipDate": json["shipDate"],
      "AccountCode": json["accountCode"],
      "AccountName": json["accountName"],
      "Address": json["address"],
      "Address2": json["address2"],
      "BlanketAgreementNumber": json["blanketAgreementNumber"],
      "DiscountPercent": json["discountPercent"],
    };

    if (type === 'S') {
      delete line.ItemCode;
      delete line.UnitPrice;
    }

    return line;
  }


}