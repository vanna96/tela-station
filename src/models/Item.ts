import Model from './Model';


export default class Item extends Model {
    itemCode?: string;
    itemName?: string;
    foreignName?: string;
    itemGroupCode?: number;
    itemsGroupName?: string;
    saleVatGroup?: string;
    barCode?: string;
    purchaseItem?: boolean;
    saleItem?: boolean;
    inventoryItem?: boolean;
    picture?: string;
    manufacturer?: number
    quantityOnStock?: number;
    salesUnit?: number | null;
    salesItemsPerUnit?: number | null;
    purchaseUnit?: number | null;
    purchaseItemsPerUnit?: number | null;
    inventoryUOM?: string | null;
    uoMGroupEntry?: number | null;
    uoMGroupName?: number | null;
    inventoryUoMEntry?: number | null;
    defaultWarehouse?: string | null;
    ItemUnitOfMeasurementCollection?: string | null;

    constructor(json: any) {
        super();
        this.itemCode = json['ItemCode'];
        this.itemName = json['ItemName'];
        this.foreignName = json['ForeignName'];
        this.itemGroupCode = json['ItemsGroupCode'];
        this.saleVatGroup = json['SalesVATGroup'];
        this.barCode = json['BarCode'];
        this.purchaseItem = json['PurchaseItem'] === 'tYES';
        this.saleItem = json['SalesItem'] === 'tYES';
        this.inventoryItem = json['InventoryItem'] === 'tYES';
        this.picture = json['Picture'];
        this.manufacturer = json['Manufacturer']
        this.quantityOnStock = json['QuantityOnStock'];
        this.salesUnit = json['SalesUnit'];
        this.salesItemsPerUnit = json['SalesItemsPerUnit'];
        this.purchaseUnit = json['PurchaseUnit'];
        this.purchaseItemsPerUnit = json['PurchaseItemsPerUnit'];
        this.inventoryUOM = json['InventoryUOM'];
        this.uoMGroupEntry = json['UoMGroupEntry'];
        this.inventoryUoMEntry = json['InventoryUoMEntry'];
        this.defaultWarehouse = json['DefaultWarehouse'];
        this.uoMGroupName = json['UoMGroupName'];
        this.itemsGroupName = json['ItemsGroupName'];
        this.ItemUnitOfMeasurementCollection = json['ItemUnitOfMeasurementCollection'];
    }



    toJson(update?: boolean | undefined) {
        throw new Error('Method not implemented.');
    }
}