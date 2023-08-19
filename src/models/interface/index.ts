

export interface MasterDocument {
    serie: string;
    docNum: any;
    paymentMethod?: string;
    paymentTerm?: string;
    shippingType?: Array<any>;
    items: Array<any>;

    setItems(items: DocumentLine[]): void,
}


export interface DocumentLine {
    itemCode?: string;
    itemDescription?: string;
    itemGroup?: string;
    itemGroupName?: string;
    quantity?: number;
    unitPrice?: number;
    currency?: string;
    cumilativeQuantity?: number;
    cumilativeAmount?: number;
    plannedAmount?: number;
    lineDiscount?: number;
    uomGroupEntry?: number;
    uomGroupName?: number;
    uomEntry?: number;
    uomCode?: string;
    shippingType?: string | undefined;
    project?: string;
    taxCode?: string;
    taxRate?: number;
    vatGroup?: string;
    accountName?: string;
    uomLists: any[],
    // accountCode?: number;
    // discountPercent?: number;


    // 
    setItemGroup(itemGroup: any): void,
    setUOMGroup(uomGroup: any): void;
    setUOM(uom: any): void;
}
export interface ContactEmployees {
    name?: string 
    cardCode?: number 
    position?: string 
    address?: string 
    phone1?: number 
    phone2?: number 
    mobilePhone?: number 
    fax?: string 
    e_Mail?: string 
    pager?: string 
    remarks1?: string 
    remarks2?: string 
    password?: number 
    internalCode?: number 
    placeOfBirth?: string 
    dateOfBirth?: string 
    gender?: string | string;
    profession?: string 
    title?: string 
    cityOfBirth?: string 
    firstName?: string 
    middleName?: string 
    lastName?: string 
    emailGroupCode?: number 
    connectedAddressName?: string 
    connectedAddressType?: string 
    foreignCountry?: string
}

export interface BPAddresses {
    addressName?: string;
    addressName2?: string;
    addressName3?: string;
}
