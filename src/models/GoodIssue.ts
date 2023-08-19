import { dateFormat } from "../utilies";
import { BPAddress, ContactEmployee } from "./BusinessParter";
import Model from "./Model";
import { MasterDocument, DocumentLine } from "./interface/index";
import GLAccountRepository from '@/services/actions/GLAccountRepository';
import ShippingType from './ShippingType';

let index = 1;

export default class GoodIssue extends Model implements MasterDocument {
  index: number;
  id: any;
  docNum: any;
  docEntry: any;
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
  items: GoodIssueDocumentLine[];
  documentowner?: string;
  StockTransferLines?: GoodIssueDocumentLine[];
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
    this.index = index++
    this.id = json["DocEntry"];
    this.docEntry = json['DocEntry']
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
    this.items = json["DocumentLines"]?.map(
      (e: any) => new GoodIssueDocumentLine(e)
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

      TaxDate: json["taxDate"],
      DocDate: json["docDate"],
      AttachmentEntry: json["attachmentEntry"],
      DocCurrency: json["docCurrency"],
      DocRate: json["docRate"],
      Comments: json["comments"],

      // Serie: json["serie"],
      // Series: json["Series"],
      // WarehouseCode: json['warehouseCode'],
      Address2: json["address2"],
      DocumentStatus: json["DocumentStatus"],
      DocumentLines: json["items"]?.map((e: any) =>
        GoodIssueDocumentLine.toCreate(e, json["docType"])
      ),
      // Warehouse: warehouseCode,
      PriceList: json['priceList'],
      U_DOCTYPE: "I"

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
      // WarehouseCode: json['warehouseCode'],
      // Series: json["Series"],
      Address2: json["address2"],
      DocumentStatus: json["DocumentStatus"],
      DocumentLines: json["items"]?.map((e: any) =>
        GoodIssueDocumentLine.toCreate(e, json["docType"])
      ),
      // WarehouseCode: json['fromWarehouse'],
      // ToWarehouse: json['toWarehouse'],
      ShipToCode: json['shipToDefault'],
      // ContactPerson: json['contactPerson'],
      SalesPersonCode: json['salesPersonCode'],
      JournalMemo: json['journalMemo'],
      PriceList: json['priceList'],
      U_TRANSTYPE: "I",

    };
  }
}
export class GoodIssueDocumentLine extends Model implements DocumentLine {
  itemCode?: string | undefined;
  itemDescription?: string | undefined;
  itemGroup?: string | undefined;
  quantity?: number | undefined;
  unitPrice?: number | undefined;
  currency?: string | undefined;
  lineDiscount?: number;
  uomEntry?: number | undefined;
  uomCode?: string | undefined;
  accountCode?: number | undefined;
  warehouseCode?: number | undefined;
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
    this.accountCode = json['AccountCode']
    this.warehouseCode = this.warehouseCode
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
      UoMEntry: json["uomEntry"],
      AccountCode: json['accountCode'],
      UnitPrice: json["unitPrice"],
      WarehouseCode : json['warehouse'],
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
      DocEntry: json["uomGroupEntry"],
      UoMCode: json["uomCode"],
      // UoMEntry: json["uomEntry"],
      WarehouseCode: json["warehouseCode"],
      DistributionRule: json['distributionRule'],
      DistributionRule2: json['distributionRule2'],
      DistributionRule3: json['distributionRule3'],
      DistributionRule4: json['distributionRule4'],
      DistributionRule5: json['distributionRule5'],
    };

    return line;
  }
}
