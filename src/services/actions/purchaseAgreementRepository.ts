import BusinessPartner from '@/models/BusinessParter';
import Repository from '../../astractions/repository';
import PurchaseAgreement from '../../models/PurchaseAgreement';
import request from '../../utilies/request';
import BusinessPartnerRepository from './bussinessPartnerRepository';

export default class PurchaseAgreementRepository extends Repository<PurchaseAgreement> {
    url: string = '/BlanketAgreements';

    public static documentSerie = {
        Document: "1250000025",
        DocumentSubType: "S"
    }



    async get<T>(query?: string): Promise<T[]> {
        const response: any = await request('GET', this.url + query).then(async (res: any) => {
            const data = res?.data?.value?.map((e: any) => new PurchaseAgreement(e));
            return data;
        }).catch((e: Error) => {
            throw new Error(e.message);
        });

        return response;
    }

    async documentTotal<T>(query?: string): Promise<number> {
        const response: any = await request('GET', this.url + '/$count' + query).then(async (res: any) => {
            return res.data;
        }).catch((e: Error) => {
            throw new Error(e.message);
        });

        return response;
    }


    async find<T>(id: any): Promise<any> {
        const purchaseAgreement = await request('GET', `${this.url}(${id})`).then((res: any) => new PurchaseAgreement(res.data))
            .catch((e: Error) => {
                throw new Error(e.message)
            })

        const businessPartner: BusinessPartner = await new BusinessPartnerRepository().findContactEmployee(purchaseAgreement.CardCode!);
        purchaseAgreement.Email = businessPartner.email;
        purchaseAgreement.Phone = businessPartner.phone;
        purchaseAgreement.ContactPersonList = businessPartner.contactEmployee ?? [];

        return purchaseAgreement;
    }

    async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {
        if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", new PurchaseAgreement(payload).toJson(true));

        return await request('POST', this.url, new PurchaseAgreement(payload).toJson(false));
    }


    async patch(id: any, payload: any): Promise<any> {
        return await request('PATCH', this.url, new PurchaseAgreement(payload).toJson());
    }


    async delete(id: any): Promise<PurchaseAgreement> {
        throw new Error('Method not implemented.');
    }

}