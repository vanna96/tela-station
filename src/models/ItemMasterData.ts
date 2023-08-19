import { dateFormat } from "../utilies";
import Model from "./Model";
import { MasterDocument, DocumentLine } from "./interface/index";
import Department from "./Department";
import ItemGroup from './ItemGroup';
import GLAccountRepository from '@/services/actions/GLAccountRepository';
import WarehouseRepository from "@/services/warehouseRepository";


let index = 1;
// export interface ItemMasterProps {
//   id: any;
//   docNum: any;
//   cardCode?: string;
//   cardName?: string;
//   constactPersonCode?: number;
//   startDate?: string;
//   endDate?: string;
//   terminateDate?: string;
//   description?: string;
//   agreementType?: string;
//   status?: string;
//   owner?: string;
//   renewal?: boolean;
//   remindUnit?: string;
//   remindTime?: string;
//   remark?: string;
//   attachmentEntry?: number;
//   settlementProbability?: number;
//   agreementMethod?: string;
//   paymentTerm?: string;
//   priceList?: number;
//   signeDate?: string;
//   serie: string;
//   paymentMethod?: string;
//   shippingType?: string | undefined;
//   items: ItemWarehouseProps[];
//   warehouse: ItemWarehouseProps[];
// }

// export interface ItemWarehouseProps {
//   warehouseCode?: string | undefined;
//   warehouseName?: string | undefined;
//   lock?: string | undefined;
//   minimalStock?: string | undefined;
//   maximalStock?: string | undefined;
//   minimalOrder?: string | undefined;
//   standardAveragePrice?: string | undefined;
//   inStock?: string | undefined;
//   committed?: string | undefined;
//   ordered?: string | undefined;
//   defaultBin?: string | undefined;
//   defaultBinEnforced?: string | undefined;

// }

export default class ItemMaster {
  id: any;
  index: number;
  docNum: any;
  cardCode?: string;
  itemCode?: string;
  itemName?: string;
  foreignName?: string | undefined;
  itemsGroupCode?: string | undefined;
  customsGroupCode?: string | undefined;
  salesVATGroup?: string | undefined;
  barCode?: string | undefined;
  vatLiable?: boolean | undefined;
  purchaseItem?: boolean | undefined;
  salesItem?: boolean | undefined;
  inventoryItem?: boolean | undefined;
  //?: string | undefined; picture
  user_Text?: string | undefined;
  serialNum?: string | undefined;
  manufacturer?: string | undefined;
  valid?: string | undefined;
  validFrom?: string | undefined;
  validTo?: string | undefined;
  validRemarks?: string | undefined;
  frozen?: string | undefined;
  frozenFrom?: string | undefined;
  frozenTo?: string | undefined;
  frozenRemarks?: string | undefined;
  salesItemsPerUnit?: string | undefined;
  //?: string | undefined; salesPackingUnit
  //?: string | undefined; salesQtyPerUnit
  salesUnitLength?: string | undefined;
  salesLengthUnit?: string | undefined;
  salesUnitWidth?: string | undefined;
  salesWidthUnit?: string | undefined;
  salesUnitHeight?: string | undefined;
  salesHeightUnit?: string | undefined;
  salesUnitVolume?: string | undefined;
  salesVolumeUnit?: string | undefined;
  salesUnitWeight?: string | undefined;
  salesWeightUnit?: string | undefined;
  purchaseUnit?: string | undefined;
  purchaseItemsPerUnit?: string | undefined;
  //?: string | undefined; purchasePackingUnit
  purchaseQtyPerPackUnit?: string | undefined;
  purchaseUnitLength?: string | undefined;
  purchaseLengthUnit?: string | undefined;
  purchaseUnitWidth?: string | undefined;
  purchaseWidthUnit?: string | undefined;
  purchaseUnitHeight?: string | undefined;
  purchaseHeightUnit?: string | undefined;
  purchaseUnitVolume?: string | undefined;
  purchaseVolumeUnit?: string | undefined;
  purchaseUnitWeight?: string | undefined;
  purchaseWeightUnit?: string | undefined;
  purchaseVATGroup?: string | undefined;
  salesFactor1?: string | undefined;
  salesFactor2?: string | undefined;
  salesFactor3?: string | undefined;
  salesFactor4?: string | undefined;
  purchaseFactor1?: string | undefined;
  purchaseFactor2?: string | undefined;
  purchaseFactor3?: string | undefined;
  purchaseFactor4?: string | undefined;
  movingAveragePrice?: string | undefined;
  avgStdPrice?: string | undefined;
  defaultWarehouse?: string | undefined;
  shipType?: string | undefined;
  glMethod?: string | undefined;
  taxType?: string | undefined;
  maxInventory?: string | undefined;
  desiredInventory?: string | undefined;
  minInventory?: string | undefined;
  manageStockByWarehouse?: boolean | undefined;
  purchaseHeightUnit1?: string | undefined;
  purchaseUnitHeight1?: string | undefined;
  purchaseLengthUnit1?: string | undefined;
  purchaseUnitLength1?: string | undefined;
  purchaseWeightUnit1?: string | undefined;
  purchaseUnitWeight1?: string | undefined;
  purchaseWidthUnit1?: string | undefined;
  purchaseUnitWidth1?: string | undefined;
  salesHeightUnit1?: string | undefined;
  salesUnitHeight1?: string | undefined;
  salesLengthUnit1?: string | undefined;
  salesUnitLength1?: string | undefined;
  salesWeightUnit1?: string | undefined;
  salesUnitWeight1?: string | undefined;
  salesWidthUnit1?: string | undefined;
  salesUnitWidth1?: string | undefined;
  forceSelectionOfSerialNumber?: string | undefined;
  manageSerialNumbersOnReleaseOnly?: string | undefined;
  wtLiable?: boolean | undefined;
  costAccountingMethod?: string | undefined;
  itemCountryOrg?: string | undefined;
  issueMethod?: string | undefined;
  sriAndBatchManageMethod?: string | undefined;
  inventoryUOM?: string | undefined;
  itemType?: string | undefined;
  itemClass?: string | undefined;
  outgoingServiceCode?: string | undefined;
  incomingServiceCode?: string | undefined;
  serviceGroup?: string | undefined;
  ncmCode?: string | undefined;
  materialType?: string | undefined;
  materialGroup?: string | undefined;
  autoCreateSerialNumbersOnRelease?: string | undefined;
  series?: string | undefined;
  issuePrimarilyBy?: string | undefined;
  noDiscounts?: boolean | undefined;
  assetClass?: string | undefined;
  assetGroup?: string | undefined;
  inventoryNumber?: string | undefined;
  technician?: string | undefined;
  employee?: string | undefined;
  location?: string | undefined;
  assetStatus?: string | undefined;
  manageByQuantity?: string | undefined;
  uomGroupEntry?: string | undefined;
  inventoryUoMEntry?: string | undefined;
  defaultSalesUoMEntry?: string | undefined;
  defaultPurchasingUoMEntry?: string | undefined;
  inventoryWeight?: string | undefined;
  inventoryWeightUnit?: string | undefined;
  inventoryWeight1?: string | undefined;
  inventoryWeightUnit1?: string | undefined;
  defaultCountingUnit?: string | undefined;
  countingItemsPerUnit?: string | undefined;
  defaultCountingUoMEntry?: string | undefined;
  manageSerialNumbers?: string | undefined;
  manageBatchNumbers?: string | undefined;
  attachmentEntry?: string | undefined;
  createQRCodeFrom?: string | undefined;
  createDate?: string | undefined;
  updateDate?: string | undefined;
  sWW?: string | undefined;
  salesUnit?: string | undefined;
  salesQtyPerPackUnit?: string | undefined;
  manageItemByDrop?: string | undefined;
  mainsupplier?: string | undefined;
  itemPrices?: any[] | undefined;
  itemWarehouseInfoCollection?: any[] | undefined;
  itemBarCodeCollection?: any[] | undefined;
  itemPreferredVendors?: any[] | undefined;
  items?: ItemWarehouseInfo[];
  warehouse?: ItemWarehouseInfo[]


  constructor(json: any) {
    // super();
    this.index = index++
    this.cardCode = json['Mainsupplier'];
    this.id = json["ItemCode"];
    this.itemCode = json["ItemCode"];
    this.itemName = json["ItemName"];
    this.foreignName = json["ForeignName"]
    this.itemsGroupCode = json['ItemsGroupCode']
    this.customsGroupCode = json['CustomsGroupCode']
    this.salesVATGroup = json['SalesVATGroup']
    this.barCode = json['BarCode']
    this.vatLiable = json['VatLiable']
    this.purchaseItem = json['PurchaseItem']
    this.salesItem = json['SalesItem']
    this.inventoryItem = json['InventoryItem']
    this.user_Text = json['User_Text']
    this.serialNum = json['SerialNum']
    this.manufacturer = json['Manufacturer']
    this.valid = json['Valid']
    this.validFrom = json['ValidFrom']
    this.validTo = json['ValidTo']
    this.validRemarks = json['ValidRemarks']
    this.frozen = json['Frozen']
    this.frozenFrom = json['FrozenFrom']
    this.frozenTo = json['FrozenTo']
    this.frozenRemarks = json['FrozenRemarks']
    this.sWW = json['SWW']
    // Code for Item class
    this.salesItemsPerUnit = json['SalesItemsPerUnit']
    // this.salesPackagingUnit = json['SalesPackagingUnit']
    // this.salesQtyPerPackUnit = json['SalesQtyPerPackUnit']
    this.salesUnitLength = json['SalesUnitLength']
    this.salesLengthUnit = json['SalesLengthUnit']
    this.salesUnitWidth = json['SalesUnitWidth']
    this.salesWidthUnit = json['SalesWidthUnit']
    this.salesUnitHeight = json['SalesUnitHeight']
    this.salesHeightUnit = json['SalesHeightUnit']
    this.salesUnitVolume = json['SalesUnitVolume']
    this.salesVolumeUnit = json['SalesVolumeUnit']
    this.salesUnitWeight = json['SalesUnitWeight']
    this.salesWeightUnit = json['SalesWeightUnit']
    this.purchaseUnit = json['PurchaseUnit']
    this.purchaseItemsPerUnit = json['PurchaseItemsPerUnit']
    // this.purchasePackagingUnit = json['PurchasePackagingUnit']
    this.purchaseQtyPerPackUnit = json['PurchaseQtyPerPackUnit']
    this.purchaseUnitLength = json['PurchaseUnitLength']
    this.purchaseLengthUnit = json['PurchaseLengthUnit']
    this.purchaseUnitWidth = json['PurchaseUnitWidth']
    this.purchaseWidthUnit = json['PurchaseWidthUnit']
    this.purchaseUnitHeight = json['PurchaseUnitHeight']
    this.purchaseHeightUnit = json['PurchaseHeightUnit']
    this.purchaseUnitVolume = json['PurchaseUnitVolume']
    this.purchaseVolumeUnit = json['PurchaseVolumeUnit']
    this.purchaseUnitWeight = json['PurchaseUnitWeight']
    this.purchaseWeightUnit = json['PurchaseWeightUnit']
    this.purchaseVATGroup = json['PurchaseVATGroup']
    this.salesFactor1 = json['SalesFactor1']
    this.salesFactor2 = json['SalesFactor2']
    this.salesFactor3 = json['SalesFactor3']
    this.salesFactor4 = json['SalesFactor4']
    this.purchaseFactor1 = json['PurchaseFactor1']
    this.purchaseFactor2 = json['PurchaseFactor2']
    this.purchaseFactor3 = json['PurchaseFactor3']
    this.purchaseFactor4 = json['PurchaseFactor4']
    this.movingAveragePrice = json['MovingAveragePrice']
    this.avgStdPrice = json['AvgStdPrice']
    this.defaultWarehouse = json['DefaultWarehouse']
    this.shipType = json['ShipType']
    this.glMethod = json['GLMethod']
    this.taxType = json['TaxType']
    this.maxInventory = json['MaxInventory']
    this.desiredInventory = json['DesiredInventory']
    this.minInventory = json['MinInventory']
    this.manageStockByWarehouse = json['ManageStockByWarehouse']
    this.purchaseHeightUnit1 = json['PurchaseHeightUnit1']
    this.purchaseUnitHeight1 = json['PurchaseUnitHeight1']
    this.purchaseLengthUnit1 = json['PurchaseLengthUnit1']
    this.purchaseUnitLength1 = json['PurchaseUnitLength1']
    this.purchaseWeightUnit1 = json['PurchaseWeightUnit1']
    this.purchaseUnitWeight1 = json['PurchaseUnitWeight1']
    this.purchaseWidthUnit1 = json['PurchaseWidthUnit1']
    this.purchaseUnitWidth1 = json['PurchaseUnitWidth1']
    this.salesHeightUnit1 = json['SalesHeightUnit1']
    this.salesUnitHeight1 = json['SalesUnitHeight1']
    this.salesLengthUnit1 = json['SalesLengthUnit1']
    this.salesUnitLength1 = json['SalesUnitLength1']
    this.salesWeightUnit1 = json['SalesWeightUnit1']
    this.salesUnitWeight1 = json['SalesUnitWeight1']
    this.salesWidthUnit1 = json['SalesWidthUnit1']
    this.salesUnitWidth1 = json['SalesUnitWidth1']
    this.forceSelectionOfSerialNumber = json['ForceSelectionOfSerialNumber']
    this.manageSerialNumbersOnReleaseOnly = json['ManageSerialNumbersOnReleaseOnly']
    this.wtLiable = json['WTLiable']
    this.costAccountingMethod = json['CostAccountingMethod']
    this.itemCountryOrg = json['ItemCountryOrg'];
    this.issueMethod = json['IssueMethod'];
    this.sriAndBatchManageMethod = json['SRIAndBatchManageMethod'];
    this.inventoryUOM = json['InventoryUOM'];
    this.itemType = json['ItemType'];
    this.itemClass = json['ItemClass'];
    this.outgoingServiceCode = json['OutgoingServiceCode'];
    this.incomingServiceCode = json['IncomingServiceCode'];
    this.serviceGroup = json['ServiceGroup'];
    this.ncmCode = json['NCMCode'];
    this.materialType = json['MaterialType'];
    this.materialGroup = json['MaterialGroup'];
    this.autoCreateSerialNumbersOnRelease = json['AutoCreateSerialNumbersOnRelease'];
    this.series = json['Series'];
    this.issuePrimarilyBy = json['IssuePrimarilyBy'];
    this.noDiscounts = json['NoDiscounts'];
    this.assetClass = json['AssetClass'];
    this.assetGroup = json['AssetGroup'];
    this.inventoryNumber = json['InventoryNumber'];
    this.technician = json['Technician'];
    this.employee = json['Employee'];
    this.location = json['Location'];
    this.assetStatus = json['AssetStatus'];
    this.manageByQuantity = json['ManageByQuantity'];
    this.uomGroupEntry = json['UoMGroupEntry'];
    this.inventoryUoMEntry = json['InventoryUoMEntry'];
    this.defaultSalesUoMEntry = json['DefaultSalesUoMEntry'];
    this.defaultPurchasingUoMEntry = json['DefaultPurchasingUoMEntry'];
    this.inventoryWeight = json['InventoryWeight'];
    this.inventoryWeightUnit = json['InventoryWeightUnit'];
    this.inventoryWeight1 = json['InventoryWeight1'];
    this.inventoryWeightUnit1 = json['InventoryWeightUnit1'];
    this.defaultCountingUnit = json['DefaultCountingUnit'];
    this.countingItemsPerUnit = json['CountingItemsPerUnit'];
    this.defaultCountingUoMEntry = json['DefaultCountingUoMEntry'];
    this.manageSerialNumbers = json['ManageSerialNumbers'];
    this.manageBatchNumbers = json['ManageBatchNumbers'];
    this.attachmentEntry = json['AttachmentEntry'];
    this.createQRCodeFrom = json['CreateQRCodeFrom'];
    this.itemPrices = json['ItemPrices'];
    this.itemWarehouseInfoCollection = json['ItemWarehouseInfoCollection']
    // this.items = json['Items']
    // this.items = json["ItemBarCodeCollection"]?.map(
    //   (e: any) => new ItemMasterDocumentLine(e)
    // );
    this.warehouse = json["ItemWarehouseInfoCollection"]?.map(
      (e: any) => new ItemWarehouseInfo(e)
    );

    this.itemBarCodeCollection = json['ItemBarCodeCollection']
    this.itemPreferredVendors = json['ItemPreferredVendors']
    // this.isEditable = !json['Status']?.replace('as', "")?.charAt(0)?.includes('A');
    // this.items = json["DocumentLines"]?.map(
    //   (e: any) => new ItemMasterDocumentLine(e)
    // );

    // this.documentStatus = json["DocumentStatus"]
    //   .replace("bost_", "")
    //   ?.charAt(0);
    this.createDate = json['CreateDate']
    this.updateDate = json['UpdateDate']
    this.salesUnit = json['SalesUnit']
    this.salesQtyPerPackUnit = json['SalesQtyPerPackUnit']
    this.mainsupplier = json['Mainsupplier']

    if (this.manageItemByDrop = 'T') {
      json['manageBatchNumbers'] === "tYES"
    }
    else if
      (this.manageItemByDrop = 'L') {
      json['manageSerialNumbers'] === "tYES"
    }

    // this.manageItemByDrop = "T";
  }

  toJson(update: boolean) {
    throw new Error("Method not implemented.");
  }

  public static toCreate(json: any) {
    console.log(json);

    return {
      "ItemCode": json["itemCode"],
      "ItemName": json["itemName"],
      "ForeignName": json["foreignName"],
      "ItemsGroupCode": json["itemsGroupCode"],
      "CustomsGroupCode": json["customsGroupCode"],
      "SalesVATGroup": json["salesVATGroup"],
      "BarCode": json["barCode"],
      "VatLiable": json["vatLiable"],
      "PurchaseItem": json["purchaseItem"] ? 'tYES' : 'tNO',
      "SalesItem": json["salesItem"] ? 'tYES' : 'tNO',
      "InventoryItem": json["inventoryItem"] ? 'tYES' : 'tNO',
      "User_Text": json["user_Text"],
      "SerialNum": json["serialNum"],
      "Manufacturer": json["manufacturer"],
      "Valid": json["valid"],
      "ValidFrom": json["validFrom"],
      "ValidTo": json["validTo"],
      "ValidRemarks": json["validRemarks"],
      "Frozen": json["frozen"],
      "FrozenFrom": json["frozenFrom"],
      "FrozenTo": json["frozenTo"],
      "FrozenRemarks": json["frozenRemarks"],

      "SalesItemsPerUnit": json["salesItemsPerUnit"],
      "SalesUnitLength": json["salesUnitLength"],
      "SalesLengthUnit": json["salesLengthUnit"],
      "SalesUnitWidth": json["salesUnitWidth"],
      "SalesWidthUnit": json["salesWidthUnit"],
      "SalesUnitHeight": json["salesUnitHeight"],
      "SalesHeightUnit": json["salesHeightUnit"],
      "SalesUnitVolume": json["salesUnitVolume"],
      "SalesVolumeUnit": json["salesVolumeUnit"],
      "SalesUnitWeight": json["salesUnitWeight"],
      "SalesWeightUnit": json["salesWeightUnit"],
      "PurchaseUnit": json["purchaseUnit"],
      "PurchaseItemsPerUnit": json["purchaseItemsPerUnit"],
      "PurchaseQtyPerPackUnit": json["purchaseQtyPerPackUnit"],

      "PurchaseUnitLength": json["purchaseUnitLength"],
      "PurchaseLengthUnit": json["purchaseLengthUnit"],
      "PurchaseUnitWidth": json["purchaseUnitWidth"],
      "PurchaseWidthUnit": json["purchaseWidthUnit"],
      "PurchaseUnitHeight": json["purchaseUnitHeight"],
      "PurchaseHeightUnit": json["purchaseHeightUnit"],
      "PurchaseUnitVolume": json["purchaseUnitVolume"],
      "PurchaseVolumeUnit": json["purchaseVolumeUnit"],
      "PurchaseUnitWeight": json["purchaseUnitWeight"],
      "PurchaseWeightUnit": json["purchaseWeightUnit"],
      "PurchaseVATGroup": json["purchaseVATGroup"],
      "SalesFactor1": json["salesFactor1"],
      "SalesFactor2": json["salesFactor2"],
      "SalesFactor3": json["salesFactor3"],
      "SalesFactor4": json["salesFactor4"],
      "PurchaseFactor1": json["purchaseFactor1"],
      "PurchaseFactor2": json["purchaseFactor2"],
      "PurchaseFactor3": json["purchaseFactor3"],
      "PurchaseFactor4": json["purchaseFactor4"],

      "MovingAveragePrice": json["movingAveragePrice"],
      "AvgStdPrice": json["avgStdPrice"],
      "DefaultWarehouse": json["defaultWarehouse"],
      "ShipType": json["shipType"],
      "GLMethod": json["glMethod"],
      "TaxType": json["taxType"],
      "MaxInventory": json["maxInventory"],
      "DesiredInventory": json['desiredInventory'],
      "MinInventory": json['minInventory'],
      "ManageStockByWarehouse": json["manageStockByWarehouse"] ? 'tYES' : 'tNO',
      "PurchaseHeightUnit1": json["purchaseHeightUnit1"],
      "PurchaseUnitHeight1": json["purchaseUnitHeight1"],
      "PurchaseLengthUnit1": json["purchaseLengthUnit1"],
      "PurchaseUnitLength1": json["purchaseUnitLength1"],
      "PurchaseWeightUnit1": json["purchaseWeightUnit1"],
      "PurchaseUnitWeight1": json["purchaseUnitWeight1"],
      "PurchaseWidthUnit1": json["purchaseWidthUnit1"],
      "PurchaseUnitWidth1": json["purchaseUnitWidth1"],
      "SalesHeightUnit1": json["salesHeightUnit1"],
      "SalesUnitHeight1": json["salesUnitHeight1"],

      "SalesWidthUnit1": json["salesWidthUnit1"],
      "SalesUnitWidth1": json["salesUnitWidth1"],
      "ForceSelectionOfSerialNumber": json["forceSelectionOfSerialNumber"],
      "ManageSerialNumbersOnReleaseOnly": json["manageSerialNumbersOnReleaseOnly"],
      "WTLiable": json["wtLiable"] ? 'tYES' : 'tNO',
      "CostAccountingMethod": json["costAccountingMethod"],
      "ItemCountryOrg": json["itemCountryOrg"],
      "IssueMethod": json["issueMethod"],
      "SRIAndBatchManageMethod": json["sriAndBatchManageMethod"],
      "InventoryUOM": json["inventoryUOM"],
      "ItemType": json["itemType"],
      "ItemClass": json["itemClass"],
      "OutgoingServiceCode": json["outgoingServiceCode"],
      "IncomingServiceCode": json["incomingServiceCode"],
      "ServiceGroup": json["serviceGroup"],
      "NCMCode": json["ncmCode"],
      "MaterialType": json["materialType"],
      "MaterialGroup": json["materialGroup"],

      "AutoCreateSerialNumbersOnRelease": json["autoCreateSerialNumbersOnRelease"],
      // "Series": json["series"],
      "IssuePrimarilyBy": json["issuePrimarilyBy"],
      "NoDiscounts": json["noDiscounts"] ? 'tYES' : 'tNO',
      "AssetClass": json["assetClass"],
      "AssetGroup": json["assetGroup"],
      "InventoryNumber": json["inventoryNumber"],
      "Technician": json["technician"],
      "Employee": json["employee"],
      "Location": json["location"],
      "AssetStatus": json["assetStatus"],
      "ManageByQuantity": json["manageByQuantity"],
      "UoMGroupEntry": json["uomGroupEntry"],
      "InventoryUoMEntry": json["inventoryUoMEntry"],
      "DefaultSalesUoMEntry": json["defaultSalesUoMEntry"],
      "DefaultPurchasingUoMEntry": json["defaultPurchasingUoMEntry"],
      "InventoryWeight": json["inventoryWeight"],
      "InventoryWeightUnit": json["inventoryWeightUnit"],
      "InventoryWeight1": json["inventoryWeight1"],
      "InventoryWeightUnit1": json["inventoryWeightUnit1"],

      "DefaultCountingUnit": json["defaultCountingUnit"],
      "CountingItemsPerUnit": json["countingItemsPerUnit"],
      "DefaultCountingUoMEntry": json["defaultCountingUoMEntry"],
      // "ManageSerialNumbers": json["manageSerialNumbers"],
      // "ManageBatchNumbers": json["manageBatchNumbers"],
      "AttachmentEntry": json["attachmentEntry"],
      "CreateQRCodeFrom": json["createQRCodeFrom"],
      "ItemPrices": json["itemPrices"],
      // "ItemWarehouseInfoCollection": json["itemWarehouseInfoCollection"],
      "ItemBarCodeCollection": json["itemBarCodeCollection"],
      "ItemPreferredVendors": [
        {
          "BPCode": json["cardCode"]
        }
      ],
      // "Mainsupplier" : json['cardCode'],
      DocumentStatus: json["DocumentStatus"],
      "ItemWarehouseInfoCollection": json["warehouse"]?.map((e: any) =>
        ItemWarehouseInfo.toCreate(e)
      ),
      // "Type": "dDocument_Items",


      // documentLine: json["items"]?.map((e: any) =>
      // ItemMasterDocumentLine.toCreate(e, json["DocType"])),
      "SWW": json['sWW'],
      "SalesUnit": json['salesUnit'],
      "SalesQtyPerPackUnit": json['salesQtyPerPackUnit'],
      "ManageSerialNumbers": json['manageItemByDrop'] === 'L' ? "tYES" : "tNO",
      "ManageBatchNumbers": json['manageItemByDrop'] === 'T' ? "tYES" : "tNO",

    };
  }

  public static toUpdate(json: any) {
    return {
      "ItemCode": json["itemCode"],
      "ItemName": json["itemName"],
      "ForeignName": json["foreignName"],
      "ItemsGroupCode": json["itemsGroupCode"],
      "CustomsGroupCode": json["customsGroupCode"],
      "SalesVATGroup": json["salesVATGroup"],
      "BarCode": json["barCode"],
      "VatLiable": json["vatLiable"],
      "PurchaseItem": json["purchaseItem"] ? 'tYES' : 'tNO',
      "SalesItem": json["salesItem"] ? 'tYES' : 'tNO',
      "InventoryItem": json["inventoryItem"] ? 'tYES' : 'tNO',
      "User_Text": json["user_Text"],
      "SerialNum": json["serialNum"],
      "Manufacturer": json["manufacturer"],
      "Valid": json["valid"],
      "ValidFrom": json["validFrom"],
      "ValidTo": json["validTo"],
      "ValidRemarks": json["validRemarks"],
      "Frozen": json["frozen"],
      "FrozenFrom": json["frozenFrom"],
      "FrozenTo": json["frozenTo"],
      "FrozenRemarks": json["frozenRemarks"],

      "SalesItemsPerUnit": json["salesItemsPerUnit"],
      "SalesUnitLength": json["salesUnitLength"],
      "SalesLengthUnit": json["salesLengthUnit"],
      "SalesUnitWidth": json["salesUnitWidth"],
      "SalesWidthUnit": json["salesWidthUnit"],
      "SalesUnitHeight": json["salesUnitHeight"],
      "SalesHeightUnit": json["salesHeightUnit"],
      "SalesUnitVolume": json["salesUnitVolume"],
      "SalesVolumeUnit": json["salesVolumeUnit"],
      "SalesUnitWeight": json["salesUnitWeight"],
      "SalesWeightUnit": json["salesWeightUnit"],
      "PurchaseUnit": json["purchaseUnit"],
      "PurchaseItemsPerUnit": json["purchaseItemsPerUnit"],
      "PurchaseQtyPerPackUnit": json["purchaseQtyPerPackUnit"],

      "PurchaseUnitLength": json["purchaseUnitLength"],
      "PurchaseLengthUnit": json["purchaseLengthUnit"],
      "PurchaseUnitWidth": json["purchaseUnitWidth"],
      "PurchaseWidthUnit": json["purchaseWidthUnit"],
      "PurchaseUnitHeight": json["purchaseUnitHeight"],
      "PurchaseHeightUnit": json["purchaseHeightUnit"],
      "PurchaseUnitVolume": json["purchaseUnitVolume"],
      "PurchaseVolumeUnit": json["purchaseVolumeUnit"],
      "PurchaseUnitWeight": json["purchaseUnitWeight"],
      "PurchaseWeightUnit": json["purchaseWeightUnit"],
      "PurchaseVATGroup": json["purchaseVATGroup"],
      "SalesFactor1": json["salesFactor1"],
      "SalesFactor2": json["salesFactor2"],
      "SalesFactor3": json["salesFactor3"],
      "SalesFactor4": json["salesFactor4"],
      "PurchaseFactor1": json["purchaseFactor1"],
      "PurchaseFactor2": json["purchaseFactor2"],
      "PurchaseFactor3": json["purchaseFactor3"],
      "PurchaseFactor4": json["purchaseFactor4"],

      "MovingAveragePrice": json["movingAveragePrice"],
      "AvgStdPrice": json["avgStdPrice"],
      "DefaultWarehouse": json["defaultWarehouse"],
      "ShipType": json["shipType"],
      "GLMethod": json["glMethod"],
      "TaxType": json["taxType"],
      "MaxInventory": json["maxInventory"],
      "DesiredInventory": json['desiredInventory'],
      "MinInventory": json['minInventory'],
      // "ManageStockByWarehouse": json["manageStockByWarehouse"] ? 'tYES' : 'tNO',
      "PurchaseHeightUnit1": json["purchaseHeightUnit1"],
      "PurchaseUnitHeight1": json["purchaseUnitHeight1"],
      "PurchaseLengthUnit1": json["purchaseLengthUnit1"],
      "PurchaseUnitLength1": json["purchaseUnitLength1"],
      "PurchaseWeightUnit1": json["purchaseWeightUnit1"],
      "PurchaseUnitWeight1": json["purchaseUnitWeight1"],
      "PurchaseWidthUnit1": json["purchaseWidthUnit1"],
      "PurchaseUnitWidth1": json["purchaseUnitWidth1"],
      "SalesHeightUnit1": json["salesHeightUnit1"],
      "SalesUnitHeight1": json["salesUnitHeight1"],

      "SalesWidthUnit1": json["salesWidthUnit1"],
      "SalesUnitWidth1": json["salesUnitWidth1"],
      "ForceSelectionOfSerialNumber": json["forceSelectionOfSerialNumber"],
      "ManageSerialNumbersOnReleaseOnly": json["manageSerialNumbersOnReleaseOnly"],
      "WTLiable": json["wtLiable"] ? 'tYES' : 'tNO',
      "CostAccountingMethod": json["costAccountingMethod"],
      "ItemCountryOrg": json["itemCountryOrg"],
      "IssueMethod": json["issueMethod"],
      "SRIAndBatchManageMethod": json["sriAndBatchManageMethod"],
      "InventoryUOM": json["inventoryUOM"],
      "ItemType": json["itemType"],
      "ItemClass": json["itemClass"],
      "OutgoingServiceCode": json["outgoingServiceCode"],
      "IncomingServiceCode": json["incomingServiceCode"],
      "ServiceGroup": json["serviceGroup"],
      "NCMCode": json["ncmCode"],
      "MaterialType": json["materialType"],
      "MaterialGroup": json["materialGroup"],

      "AutoCreateSerialNumbersOnRelease": json["autoCreateSerialNumbersOnRelease"],
      // "Series": json["series"],
      "IssuePrimarilyBy": json["issuePrimarilyBy"],
      "NoDiscounts": json["noDiscounts"] ? 'tYES' : 'tNO',
      "AssetClass": json["assetClass"],
      "AssetGroup": json["assetGroup"],
      "InventoryNumber": json["inventoryNumber"],
      "Technician": json["technician"],
      "Employee": json["employee"],
      "Location": json["location"],
      "AssetStatus": json["assetStatus"],
      // "ManageByQuantity": json["manageByQuantity"],
      "UoMGroupEntry": json["uomGroupEntry"],
      "InventoryUoMEntry": json["inventoryUoMEntry"],
      "DefaultSalesUoMEntry": json["defaultSalesUoMEntry"],
      "DefaultPurchasingUoMEntry": json["defaultPurchasingUoMEntry"],
      "InventoryWeight": json["inventoryWeight"],
      "InventoryWeightUnit": json["inventoryWeightUnit"],
      "InventoryWeight1": json["inventoryWeight1"],
      "InventoryWeightUnit1": json["inventoryWeightUnit1"],

      "DefaultCountingUnit": json["defaultCountingUnit"],
      "CountingItemsPerUnit": json["countingItemsPerUnit"],
      "DefaultCountingUoMEntry": json["defaultCountingUoMEntry"],
      // "ManageSerialNumbers": json["manageSerialNumbers"],
      // "ManageBatchNumbers": json["manageBatchNumbers"],
      "AttachmentEntry": json["attachmentEntry"],
      "CreateQRCodeFrom": json["createQRCodeFrom"],
      "ItemPrices": json["itemPrices"],
      "ItemBarCodeCollection": json["itemBarCodeCollection"],
      // "ItemPreferredVendors": json["itemPreferredVendors"],
      // "ItemPreferredVendors": json["cardCode"]  ,
      "ItemPreferredVendors": [
        {
          "BPCode": json["cardCode"]
        }
      ],
      // 
      // "ManageSerialNumbers": json['manageItemByDrop'] === 'L' ? "tYES" : "tNO",
      // "ManageBatchNumbers": json['manageItemByDrop'] === 'T' ? "tYES" : "tNO",
      DocumentStatus: json["DocumentStatus"],
      "ItemWarehouseInfoCollection": json["warehouse"]?.map((e: any) =>
        ItemWarehouseInfo.toCreate(e)
      ),
      
      // "Mainsupplier" : json['cardCode'],

      // DocumentLines: json["items"]?.map((e: any) =>
      //   ItemMasterDocumentLine.toCreate(e, json["docType"])
      // ),
      // "Type": "dDocument_Items",


      // documentLine: json["items"]?.map((e: any) =>
      // ItemMasterDocumentLine.toCreate(e, json["DocType"])),
    };
  }
}
export class ItemWarehouseInfo extends Model {

  // lock?: string | undefined;
  locked?: boolean | undefined;
  inStock?: string | undefined;
  committed?: string | undefined;
  ordered?: string | undefined;
  warehouseCode?: string | undefined;
  warehouseName?: string | undefined;
  minimalStock?: string | undefined;
  maximalStock?: string | undefined;
  minimalOrder?: string | undefined;
  standardAveragePrice?: string | undefined;
  defaultBin?: string | undefined;
  defaultBinEnforced?: string | undefined;
  available?: string | undefined;

  constructor(json: any) {
    super();
    this.locked = json['Locked']
    this.inStock = json['InStock'];
    this.committed = json['Committed'];
    this.ordered = json['Ordered'];
    this.warehouseCode = json['WarehouseCode']
    this.warehouseName = new WarehouseRepository().find(json['WarehouseCode'])?.WarehouseName ?? "N/A"
    this.minimalStock = json['MinimalStock']
    this.maximalStock = json['MaximalStock']
    this.minimalOrder = json['MinimalOrder']
    this.standardAveragePrice = json['StandardAveragePrice']
    this.defaultBin = json['DefaultBin']
    this.defaultBinEnforced = json['DefaultBinEnforced']
    this.available = json['Available']
  }
  toJson(update: boolean) {
    throw new Error("Method not implemented.");
  }

  public static toCreate(json: any,) {
    let line = {
      // Lock: json['lock'],
      Locked: json["locked"] ? 'tYES' : 'tNO',
      InStock: json['inStock'],
      Committed: json['committed'],
      Ordered: json['ordered'],
      Available: json['available'],
      WarehouseCode: json['warehouseCode'],
      // warehouseName : new WarehouseRepository().find,(json['WarehouseCode'])?.WarehouseName ?? "N/A"
      MinimalStock: json['minimalStock'],
      MaximalStock: json['maximalStock'],
      MinimalOrder: json['minimalOrder'],
      StandardAveragePrice: json['standardAveragePrice'],
      DefaultBin: json['defaultBin'],
      DefaultBinEnforced: json['defaultBinEnforced'],
    };

    return line;
  }

}