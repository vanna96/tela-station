import { isItemType } from '@/constants';
import { ContactEmployee } from '@/models/BusinessParter';
import { LineDocumentModel, MasterDocumentModel } from '@/models/Model';
import GLAccountRepository from '@/services/actions/GLAccountRepository';


export default class PurchaseOrder extends MasterDocumentModel {
    Series: string;
    DocEntry: any;
    DocNum: any;
    CardCode?: string;
    CardName?: string;
    ContactPersonCode?: number;
    DocDate?: string;
    DocDueDate?: string;
    RequriedDate?: string
    TerminateDate?: string;
    DocTotalSys?: number;
    Description?: string;
    ContactPersonList?: ContactEmployee[];
    VatSum?: number;
    Status?: string;
    DocumentsOwner?: string;
    Remark?: string;
    TransportationCode?: string;
    AttachmentEntry?: number;
    PaymentGroupCode?: string;
    PriceList?: number;
    JournalMemo?: string;
    Items: PurchaseOrderLine[];
    TaxDate: string;
    Comments: string;
    SalesPersonCode?: number;
    DocType: string;
    Address: string;
    Address2: string;
    ExtraMonth: string;
    ExtraDays: string;
    CashDiscountDateOffset: number;
    CreateQRCodeFrom: string;
    NumAtCard?: string;
    CancelDate: string;
    Indicator: string;
    FederalTaxID: string;
    ImportFileNum: string;
    Currency: string;
    DocumentStatus: string;
    Project: string;
    DocumentLines: any;


    constructor(json: any) {
        super();

        this.Series = json['Series'];
        this.DocEntry = json['DocEntry'];
        this.DocumentStatus = json['DocumentStatus'];
        this.FederalTaxID = json['FederalTaxID']
        this.ExtraMonth = json['ExtraMonth'];
        this.ExtraDays = json['ExtraDays'];
        this.DocType = json['DocType'];
        this.DocNum = json['DocNum'];
        this.VatSum = json['VatSum'];
        this.JournalMemo = json['JournalMemo']
        this.CardName = json['CardName'];
        this.ContactPersonList = json['contactPersonList'];
        this.CardCode = json['CardCode'];
        this.DocTotalSys = json['DocTotalSys'];
        this.DocumentsOwner = json['DocumentsOwner'];
        this.NumAtCard = json['NumAtCard'];
        this.SalesPersonCode = json['SalesPersonCode'];
        this.ContactPersonCode = json['ContactPersonCode'];
        this.Description = json['Description'];
        this.DocDate = json['DocDate'];
        this.DocDueDate = json['DocDueDate'];
        this.TransportationCode = json['TransportationCode'];
        this.PaymentGroupCode = json['PaymentGroupCode'];
        this.TaxDate = json['TaxDate'];
        this.Comments = json['Comments'];
        this.Address = json['Address'];
        this.Address2 = json['Address2'];
        this.CashDiscountDateOffset = json['CashDiscountDateOffset'];
        this.CreateQRCodeFrom = json['CreateQRCodeFrom'];
        this.CancelDate = json['CancelDate'];
        this.Indicator = json['Indicator'];
        this.ImportFileNum = json['ImportFileNum'];
        this.PaymentMethod = json['PaymentMethod'];
        this.Currency = json['DocCurrency'];
        this.Project = json['Project'];
        this.Items = (json['DocumentLines'] ?? json['Items'])?.map((e: any) => new PurchaseOrderLine(e));
    }

    setItem(items: any[]) {
        throw new Error('Method not implemented.');
    }

    toJson(update = false) {
        return {
            "Series": update ? null : this.Series,
            "DocumentStatus": this.DocumentStatus,
            "ImportFileNum": this.ImportFileNum,
            "FederalTaxID": this.FederalTaxID,
            "Indicator": this.Indicator,
            "CancelDate": this.CancelDate,
            "SalesPersonCode": this.SalesPersonCode,
            "DocTotalSys": this.DocTotalSys,
            "CashDiscountDateOffset": this.CashDiscountDateOffset,
            "ExtraMonth": this.ExtraMonth,
            "ExtraDays": this.ExtraDays,
            "JournalMemo": this.JournalMemo,
            "CardCode": this.CardCode,
            "CardName": this.CardName,
            "NumAtCard": this.NumAtCard,
            "Comments": this.Comments,
            "DocType": this.DocType,
            "Address": this.Address,
            "Address2": this.Address2,
            "ContactPersonCode": this.ContactPersonCode,
            "DocDate": this.DocDate,
            "DocDueDate": this.DocDueDate,
            "RequriedDate": this.RequriedDate,
            "TerminateDate": this.TerminateDate,
            "Description": this.Description,
            "Status": this.Status,
            "DocumentsOwner": this.DocumentsOwner,
            "Remarks": this.Remark,
            "AttachmentEntry": this.AttachmentEntry,
            "PaymentGroupCode": this.PaymentGroupCode,
            "PaymentMethod": this.PaymentMethod,
            "TransportationCode": this.TransportationCode,
            "Project": this.Project,
            "DocNum": this.DocNum,
            "DocCurrency": this.Currency,
            "TaxDate": this.TaxDate,
            "CreateQRCodeFrom": this.CreateQRCodeFrom,
            "DocumentLines": this.Items.map((e) => e.toJson(this.DocType, update))
        };
    }

}

export class PurchaseOrderLine extends LineDocumentModel {

    ItemCode?: string | undefined;
    ItemName?: string | undefined;
    Quantity?: number | undefined;
    UnitPrice?: number | undefined;
    Currency?: string | undefined;
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
    AccountNo?: string | undefined;
    AccountNameD?: string | undefined;
    BlanketAgreementNumber?: string | undefined;
    DiscountPercent?: string;
    RequriedDate?: string;
    VatRate?: number;

    constructor(json: any) {
        super();
        this.ItemCode = json['ItemCode'];
        this.ItemName = json['ItemName'] ?? json['ItemDescription'];
        this.Quantity = json['Quantity'];
        this.UnitPrice = json['UnitPrice'];
        this.Currency = json['PriceCurrency'];
        this.LineDiscount = json['LineDiscount'];
        this.UomCode = json['UoMCode'] ?? json['UomCode'];
        this.Project = json['Project'];
        this.VatGroup = json['VatGroup'];
        this.DiscountPercent = json['DiscountPercent'];
        this.AccountNo = json['AccountCode'];
        this.LineTotal = json['LineTotal'];
        this.BlanketAgreementNumber = json['BlanketAgreementNumber'];
        this.VatRate = json['TaxPercentagePerRow'];
        this.AccountNameD = new GLAccountRepository().find(json["AccountCode"])?.Name
    }


    toJson(type: string, update?: boolean | undefined) {
        let line = {
            "ItemCode": this.ItemCode,
            "ItemDescription": this.ItemName,
            "UnitPrice": this.UnitPrice,
            "Quantity": this.Quantity,
            "LineDiscount": 0.0,
            "UoMCode": this.UomCode,
            "TransportationCode": 1,
            "Project": null,
            "TaxCode": null,
            "TAXRate": null,
            "VatGroup": this.VatGroup,
            "LineTotal": this.LineTotal,
            "RequiredDate": this.RequiredDate,
            "ShipDate": this.ShipDate,
            "AccountCode": this.AccountNo,
            "AccountName": this.AccountNameD,
            "BlanketAgreementNumber": this.BlanketAgreementNumber,
            "DiscountPercent": this.DiscountPercent,
        };


        if (!isItemType(type)) {
            delete line.ItemCode;
            // delete line.UnitPrice;
        }


        return line;
    }
}