import Model from "./Model";


export default class BusinessPartner extends Model {
    cardCode?: string | null | undefined;
    cardCode2?: string | null | undefined;
    cardName?: string | null | undefined;
    cardType?: string | null | undefined;
    groupCode?: string | null | undefined;
    address?: string | null | undefined;
    mailAddress?: string | null | undefined;
    phone?: string | null | undefined;
    contactPerson?: string | null | undefined;
    salePersonCode?: string | null | undefined;
    note?: string | null | undefined;
    paymentTermTypeCode?: string | null | undefined;
    federalTaxId?: string | null | undefined;
    currency?: string | null | undefined;
    city?: string | null | undefined;
    country?: string | null | undefined;
    email?: string | null | undefined;
    picture?: string | null | undefined;
    defaultAccount?: string | null | undefined;
    defaultBranch?: string | null | undefined;
    defaultBankCode?: string | null | undefined;
    currentBalance?: number | null | undefined;
    priceLists: string | null | undefined;
    deliveryNoteBalance?: number | null | undefined;
    street: string | null | undefined;
    openOrderBalance?: number | null | undefined;;
    vatGroup?: string | null | undefined;
    shippingType?: number | null | undefined;;
    indicator?: string | null | undefined;
    paymentMethod?: string | null | undefined;
    shipToDefault?: string | null | undefined;
    billToDefault?: string | null | undefined;
    website?: string | null | undefined;
    bpAddress?: BPAddress[] | null | undefined;;
    contactEmployee?: ContactEmployee[] | null | undefined;
    bpPaymentMethod?: [] | null | undefined;;
    internalCode?: number | null | undefined;
    id?: number;
    owner?: number | null;
    defaultCurrency?: string;
    currenciesCollection?: any[];
    PriceMode?: string | null | undefined;

    constructor(json: any, index: number) {
        super();
        this.id = index + 1;
        this.cardCode = json?.CardCode;
        this.cardCode2 = json?.CardCode2;
        this.cardName = json?.CardName;
        this.internalCode = json?.InternalCode;
        this.cardType = json?.CardType;
        this.groupCode = json?.GroupCode;
        this.address = json?.Address;
        this.mailAddress = json?.MailAddress;
        this.phone = json?.Phone1;
        this.contactPerson = json?.ContactPerson;
        this.salePersonCode = json?.SalesPersonCode;
        this.note = json?.Notes;
        this.paymentTermTypeCode = json?.PayTermsGrpCode;
        this.federalTaxId = json?.FederalTaxID;
        this.currency = json?.Currency;
        this.city = json?.City;
        this.country = json?.Country;
        this.email = json?.EmailAddress;
        this.picture = json?.Picture;
        this.defaultAccount = json?.DefaultAccount;
        this.defaultBranch = json?.DefaultBranch;
        this.defaultBankCode = json?.DefaultBankCode;
        this.currentBalance = json?.CurrentAccountBalance;
        this.deliveryNoteBalance = json?.OpenDeliveryNotesBalance;
        this.openOrderBalance = json?.OpenOrdersBalance;
        this.vatGroup = json?.VatGroup;
        this.shippingType = json?.ShippingType;
        this.indicator = json?.Indicator;
        this.paymentMethod = json?.PeymentMethodCode;
        this.shipToDefault = json?.ShipToDefault;
        this.billToDefault = json?.BilltoDefault;
        this.website = json?.Website;
        this.bpAddress = json?.BPAddresses?.map((e: any) => new BPAddress(e));
        this.contactEmployee = json?.ContactEmployees?.map((e: any) => new ContactEmployee(e));
        this.bpPaymentMethod = json?.BPPaymentMethods;
        this.priceLists = json?.PriceListNum;
        this.owner = json?.OwnerCode;
        this.defaultCurrency = json?.DefaultCurrency;
        this.currenciesCollection = json?.BPCurrenciesCollection;
        this.PriceMode = json?.PriceMode;
    }


    toJson(update: boolean) {
        throw new Error("Method not implemented.");
    }


    // public getShippingToAddress() : string {
    //     const shipAddress = this.bpAddress?.find((e: BPAddress) => e.addressName === this.shipToDefault);

    //     if (!shipAddress) return '';

    //     return `${shipAddress.street}, ${shipAddress.city}, ${shipAddress.country}.`;
    // }

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

