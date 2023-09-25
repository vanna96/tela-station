import Repository from "@/astractions/repository";
import BusinessPartner from "@/models/BusinessParter";
import request from "@/utilies/request";



export default class BusinessPartnerRepository extends Repository<BusinessPartner> {
    url = '/BusinessPartners';

    queryList = [
        "ShipToDefault",
        "ShippingType",
        "CardName",
        "CardCode",
        "CurrentAccountBalance",
        "Currency",
        "PriceListNum",
        "ContactEmployees",
        "SalesPersonCode",
        "OwnerCode",
        "VatGroup",
        'BPAddresses',
        'BPAccountReceivablePaybleCollection',
        'CardType',
        'BPBankAccounts',
        'PeymentMethodCode',
        'BPPaymentMethods',
        'PayTermsGrpCode',
        "BilltoDefault",
        "EmailAddress",
        "Phone1",
        "PriceListNum",
        "DefaultCurrency",
        "BPCurrenciesCollection",
        "PriceMode",
        "BPBranchAssignment"
    ];

    async get<BusinessPartner>(query?: string | undefined): Promise<BusinessPartner[]> {
        // return await request('GET', this.url + "?$select=" + this.queryList.join(',') + query ?? '').then((res: any) => res?.data?.value).catch((e) => {
        return await request('GET', this.url + "?$top=100" + "&$select=" + this.queryList.join(',') + query ?? '').then((res: any) => res?.data?.value).catch((e) => {
            throw new Error(e);
        });
    }

    async find<T>(cardCode: string): Promise<any> {
        const filter = `$filter=CardCode eq '${cardCode}'`;
        const selectFields = this.queryList.join(',');

        return await request('GET', `${this.url}?${filter}&$select=${selectFields}`)
            .then((res: any) => {
                const data = res?.data?.value;
                if (Array.isArray(data) && data.length > 0) {
                    // If there are results, return the first item as an object
                    return data[0];
                } else {
                    // If there are no results, return null or handle it as needed
                    return null;
                }
            })
            .catch((e) => {
                throw new Error(e);
            });
    }




    async findContactEmployee<T>(id: string): Promise<any> {
        return await request('GET', `${this.url}('${id}')?$select=${['EmailAddress', 'Phone1', 'ContactEmployees', 'BPAddresses', 'ShipToDefault'].join(',')}`).then((res: any) => new BusinessPartner(res.data))
            .catch((e: Error) => {
                throw new Error(e.message);
            })
    }

    async findShipToAddress<T>(id: string): Promise<any> {
        return await request('GET', `${this.url}('${id}')?$select=${['BPAddresses', 'ShipToDefault'].join(',')}`).then((res: any) => new BusinessPartner(res.data))
            .catch((e: Error) => {
                throw new Error(e.message);
            })
    }


    post(payload: any): Promise<BusinessPartner> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<BusinessPartner> {
        throw new Error("Method not implemented.");
    }
    delete(id: any): Promise<BusinessPartner> {
        throw new Error("Method not implemented.");
    }

}