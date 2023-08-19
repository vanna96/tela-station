import { dateFormat } from "../utilies";
import { BPAddress, ContactEmployee } from "./BusinessParter";
import Model from "./Model";
import { MasterDocument, DocumentLine } from "./interface/index";
import GLAccountRepository from '@/services/actions/GLAccountRepository';
import ShippingType from './ShippingType';

export interface StockDamageRequestProps {
  id: any;
  docNum: any;
  cardCode?: string;
  cardName?: string;
  constactPersonCode?: number;
  startDate?: string;
  endDate?: string;
  terminateDate?: string;
  description?: string;
  agreementType?: string;
  status?: string;
  owner?: string;
  renewal?: boolean;
  remindUnit?: string;
  remindTime?: string;
  remark?: string;
  attachmentEntry?: number;
  settlementProbability?: number;
  agreementMethod?: string;
  paymentTerm?: string;
  priceList?: number;
  signeDate?: string;
  serie: string;
  paymentMethod?: string;
  shippingType?: BPAddress[];
  items: StockDamageRequestDocumentLineProps[];
  StockTransferLines: StockDamageRequestDocumentLineProps[];
  contactPersonList?: ContactEmployee[];
  ShippingType?: BPAddress[]
  shippingList?: BPAddress[];
  series?: BPAddress[];


}

export interface StockDamageRequestDocumentLineProps {
  itemNo?: string | undefined;
  itemDescription?: string | undefined;
  itemGroup?: string | undefined;
  quantity?: number | undefined;
  unitPrice?: number | undefined;
  currency?: string | undefined;
  lineDiscount?: number;
  uomEntry?: number | undefined;
  uomCode?: string | undefined;
  shippingType?: BPAddress[];
  project?: string | undefined;
  vatGroup?: string | undefined;
}

export default class StockDamageRequest extends Model implements MasterDocument {
  id: any;
  docNum: any;
  cardCode?: string;
  cardName?: string;
  docDate?: string;
  docDueDate?: string;
  attachmentEntry?: number;
  docCurrency?: string;
  reference1?: string;
  comments?: string;
  journalMemo?: string;
  salesPersonCode?: string;
  contactPersonCode?: string;
  // services?: string;
  taxDate?: string;
  address?: string;
  documentStatus?: string;
  serie: string;
  shippingType?: BPAddress[];
  items: StockDamageRequestDocumentLine[];
  documentowner?: string;
  StockTransferLines?: StockDamageRequestDocumentLine[];
  fromWarehouse?: string;
  toWarehouse?: string;
  shipToDefault?: string;
  owner?: number;
  status?: string;
  contactPerson?: string;
  dueDate?: string;
  series?: BPAddress[];
  contactPersonList?: ContactEmployee[];
  ShippingType?: BPAddress[];
  shipToCode?: string | undefined;
  priceList?: string | undefined;
  distributionRule?: string | undefined;
  distributionRule2?: string | undefined;
  priceLists?: string | undefined;
  ContactPerson?: string | undefined;
  U_TRANSTYPE?: string | undefined;


  constructor(json: any) {
    super();
    this.id = json["DocNum"];
    this.cardCode = json["CardCode"];
    this.cardName = json["CardName"];
    this.serie = json["Seriesss"];
    this.owner = json["DocumentsOwner"];
    this.status = json["DocumentStatus"];
    this.docNum = json["DocNum"];
    this.taxDate = json["TaxDate"];
    this.dueDate = json["DocDueDate"];
    this.docDate = json["DocDate"];
    // this.docType = json["DocType"].replace("dDocument_", "")?.charAt(0);
    this.comments = json["Comments"];
    this.items = json["StockTransferLines"]?.map(
      (e: any) => new StockDamageRequestDocumentLine(e)
    );
    this.StockTransferLines = json["StockTransferLines"]?.map(
      (e: any) => new StockDamageRequestDocumentLine(e)
    );
    this.documentStatus = json["DocumentStatus"]
      .replace("bost_", "")
      ?.charAt(0);
    this.fromWarehouse = json['FromWarehouse'];
    this.toWarehouse = json['ToWarehouse'];
    // this.shipToCode = json['ShipToCode'];
    this.salesPersonCode = json['SalesPersonCode']
    this.contactPerson = json['ContactPerson']
    this.address = json['Address']
    this.reference1 = json['Reference1']
    this.journalMemo = json['JournalMemo']
    this.documentStatus = json['DocumentStatus']
    this.contactPersonList = json['contactPersonList'];
    this.shippingType = json['shippingType']
    this.series = json['series'];
    this.shippingType = json['shippingType']
    this.shipToDefault = json['shipToDefault']
    this.priceList = json['PriceList']
    this.priceLists = json['PriceList']
    this.salesPersonCode = json["SalesPersonCode"]
    this.distributionRule = json['DistributionRule']
    this.distributionRule2 = json['DistributionRule2']
    this.shippingType = json['shippingList']
    this.shipToCode = json['ShipToCode']

  }

  toJson(update: boolean) {
    throw new Error("Method not implemented.");
  }

  public static toCreate(json: any) {
    console.log(json);

    return {
      CardCode: json['cardCode'],
      CardName: json['cardName'],
      TaxDate: json["taxDate"],
      DocDate: json["docDate"],
      AttachmentEntry: json["attachmentEntry"],
      DocCurrency: json["docCurrency"],
      DocRate: json["docRate"],
      Comments: json["comments"],
      U_TRANSTYPE: "D",

      // Serie: json["serie"],
      // Series: json["Series"],

      Address2: json["Address2"],
      DocumentStatus: json["DocumentStatus"],
      StockTransferLines: json["items"]?.map((e: any) =>
        StockDamageRequestDocumentLine.toCreate(e, json["docType"])
      ),
      FromWarehouse: json['fromWarehouse'],
      ToWarehouse: json['toWarehouse'],
      ShipToCode: json['shipToDefault'],
      ContactPerson: json['contactPerson'],
      SalesPersonCode: json['SalesPersonCode'],
      PriceList: json['priceList']

    };
  }

  public static toUpdate(json: any) {
    return {
      TaxDate: json["taxDate"],
      DocDate: json["docDate"],
      AttachmentEntry: json["attachmentEntry"],
      DocCurrency: json["docCurrency"],
      DocRate: json["docRate"],
      Comments: json["comments"],
      // Serie: json["serie"],
      // Series: json["Series"],

      Address2: json["Address2"],
      DocumentStatus: json["DocumentStatus"],
      StockTransferLines: json["items"]?.map((e: any) =>
        StockDamageRequestDocumentLine.toCreate(e, json["docType"])
      ),
      FromWarehouse: json['fromWarehouse'],
      ToWarehouse: json['toWarehouse'],
      ShipToCode: json['shipToDefault'],
      // ContactPerson: json['contactPerson'],
      SalesPersonCode: json['salesPersonCode'],
      JournalMemo:json['journalMemo'],
      PriceList: json['priceList'],
      U_TRANSTYPE: "D",


    };
  }
}
export class StockDamageRequestDocumentLine extends Model implements DocumentLine {
  itemCode?: string | undefined;
  itemDescription?: string | undefined;
  itemGroup?: string | undefined;
  quantity?: number | undefined;
  unitPrice?: number | undefined;
  currency?: string | undefined;
  lineDiscount?: number;
  uomEntry?: number | undefined;
  uomCode?: string | undefined;
  warehouseCode?: string;
  fromWarehouseCode?: string;
  distributionRule?: number;
  distributionRule2?: number;
  distributionRule3?: number;
  distributionRule4?: number;
  distributionRule5?: number;


  constructor(json: any) {
    super();
    this.itemCode = json["ItemCode"];
    this.itemDescription = json["ItemDescription"];
    this.itemGroup = json["ItemGroup"];
    this.quantity = json["Quantity"];
    this.unitPrice = json["UnitPrice"];
    this.currency = json["PriceCurrency"];
    this.lineDiscount = json["LineDiscount"];
    this.uomEntry = json["UoMEntry"];
    this.uomCode = json["UoMCode"];
    this.fromWarehouseCode = json["FromWarehouseCode"];
    this.warehouseCode = json["warehouseCode"]
    this.distributionRule = json['DistributionRule']
    this.distributionRule2 = json['DistributionRule2']
    this.distributionRule3 = json['DistributionRule3']
    this.distributionRule4 = json['DistributionRule4']
    this.distributionRule5 = json['DistributionRule5']

  }
  toJson(update: boolean) {
    throw new Error("Method not implemented.");
  }

  public static toCreate(json: any, type: any) {
    let line = {
      Quantity: json["quantity"],
      ItemCode: json["itemCode"],
      ItemDescription: json["itemName"],
      // UnitPrice: json["unitPrice"],
      DocEntry: json["uomGroupEntry"],
      UoMCode: json["uomCode"],
      // UoMEntry: json["uomEntry"],
      FromWarehouseCode: json["fromWarehouseCode"],
      WarehouseCode: json["warehouseCode"],
      DistributionRule: json['distributionRule'],
      DistributionRule2: json['distributionRule2'],
      DistributionRule3: json['distributionRule3'],
      DistributionRule4: json['distributionRule4'],
      DistributionRule5: json['distributionRule5'],
    };

    return line;
  }

  public static toUpdate(json: any, type: any) {
    let line = {
      Quantity: json["quantity"],
      ItemCode: json["itemCode"],
      ItemDescription: json["itemName"],
      UnitPrice: json["unitPrice"],
      DistributionRule: json['distributionRule'],
      DistributionRule2: json['distributionRule2'],
      DistributionRule3: json['distributionRule3'],
      DistributionRule4: json['distributionRule4'],
      DistributionRule5: json['distributionRule5'],
      // DocEntry: json["uomGroupEntry"],
      // UoMCode: json["uomCode"],
      // UoMEntry: json["uomEntry"],
      // FromWarehouseCode: json["fromWarehouseCode"],
      // WarehouseCode: json["warehouseCode"],
    };

    return line;
  }
}
