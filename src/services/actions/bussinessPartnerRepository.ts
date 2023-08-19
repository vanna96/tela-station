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
        "PriceMode"
    ];

    async get<BusinessPartner>(query?: string | undefined): Promise<BusinessPartner[]> {
        return await request('GET', this.url + "?$select=" + this.queryList.join(',') + query ?? '').then((res: any) => res?.data?.value).catch((e) => {
            throw new Error(e);
        });
    }

    async find<T>(id: string, query?: string[]): Promise<any> {
        return await request('GET', `${this.url}('${id}')?$select=${query?.join(',')}`).then((res: any) => new BusinessPartner(res.data))
            .catch((e: Error) => {
                throw new Error(e.message);
            })
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