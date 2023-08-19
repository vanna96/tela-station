

export default abstract class Model {
    abstract toJson(update?: boolean): any;
}


export abstract class MasterDocumentModel {
    Series: string = '';
    DocNum: any;
    PaymentMethod: string | null = null;
    PaymentTerm: string | null = null;
    ShippingType: string | null = null;
    Items: LineDocumentModel[] = [];
    

    abstract setItem(items: any[]): any;
    abstract toJson(update?: boolean): any;
}

export abstract class LineDocumentModel {
    abstract toJson(type: string, update?: boolean): any;
}