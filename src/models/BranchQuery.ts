import Model from "./Model";


export default class BranchQuery extends Model {
    cardCode?: string | null | undefined;
    cardName?: string | null | undefined;
    cardType?: string | null | undefined;
    id?: number | null | undefined;
    BPLId?: number | null | undefined
    BPLName?: string | null | undefined;
    DisabledBP?: string | null | undefined;
    Currency?: string | null | undefined;
    Balance?: number | null | undefined;
    id__?: number | null | undefined;
    bpAddress?: BPAddress[] | null | undefined;;
    contactEmployee?: ContactEmployee[] | null | undefined;
    bpPaymentMethod?: [] | null | undefined;
    shipToDefault?: string | null | undefined;
    billToDefault?: string | null | undefined;

    constructor(json: any, index: number) {
        super();
        this.id = json?.id__
        this.cardCode = json?.CardCode;
        this.cardName = json?.CardName;
        this.cardType = json?.CardType;
        this.BPLId = json?.BPLId
        this.BPLName = json?.BPLName
        this.DisabledBP = json?.DisabledBP
        this.Currency = json?.Currency
        this.Balance = json?.Balance
        this.id__ = json?.id__
        this.shipToDefault = json?.ShipToDefault;
        this.billToDefault = json?.BilltoDefault;
    }

    toJson(update: boolean) {
        throw new Error("Method not implemented.");
    }


    public getShippingAddress(shipToDefault: string, bpAddress: BPAddress[]): string {
        const shipAddress = bpAddress?.find((e: BPAddress) => e.addressName === shipToDefault);

        if (!shipAddress) return '';

        return `${shipAddress.street}, ${shipAddress.city}, ${shipAddress.country}.`;
    }

    public getShipTo(): string {
        const shipAddress = this.bpAddress?.find((e: BPAddress) => e.addressName === this.shipToDefault);

        if (!shipAddress) return '';

        return `${shipAddress.street}, ${shipAddress.city}, ${shipAddress.country}.`;
    }

    public getBillToAddress(): string {
        const shipAddress = this.bpAddress?.find((e: BPAddress) => e.addressName === this.billToDefault);

        if (!shipAddress) return '';

        return `${shipAddress.street}, ${shipAddress.city}, ${shipAddress.country}.`;
    }


}

export const getShippingAddress = (shipToDefault: string, bpAddress: BPAddress[]): string => {
    // function implementation
    const shipAddress = bpAddress?.find((e: BPAddress) => e.addressName === shipToDefault);

    if (!shipAddress) return '';

    return `${shipAddress?.street ?? ""}, ${shipAddress?.city ?? ""}, ${shipAddress?.country ?? ""}.`;
};


export class BPAddress extends Model {

    addressName?: string;
    street?: string;
    city?: string;
    country?: string;
    federalTaxId?: string;
    addressType?: string;

    constructor(json: any) {
        super();

        this.addressName = json['AddressName'];
        this.street = json['Street'];
        this.city = json['City'];
        this.country = json['Country'];
        this.federalTaxId = json['FederalTaxID'];
        this.addressType = json['AddressType'];
    }


    toJson(update: boolean) {
        throw new Error("Method not implemented.");
    }

}


export class ContactEmployee extends Model {

    id?: number;
    name?: string;

    constructor(json: any) {
        super();

        this.id = json['InternalCode'];
        this.name = json['Name']
    }


    toJson(update: boolean) {
        throw new Error("Method not implemented.");
    }

}

