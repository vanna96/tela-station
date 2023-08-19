import Repository from '@/astractions/repository';
import BusinessPartner from '@/models/BusinessParter';
import BusinessPartnerRepository from '@/services/actions/bussinessPartnerRepository';
import request from '@/utilies/request';
import PurchaseOrder from '../model';


export default class PurchaseOrderRepository extends Repository<PurchaseOrder> {

    url: string = '/PurchaseOrders';

    public static documentSerie = {
        Document: "22"
    }

    async get<T>(query?: string): Promise<T[]> {
        const response: any = await request('GET', this.url + query).then((res: any) => {
            const data = res?.data?.value?.map((e: any) => new PurchaseOrder(e));
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
        const purchaseOrder = await request('GET', `${this.url}(${id})`).then((res: any) => new PurchaseOrder(res.data))
            .catch((e: Error) => {
                throw new Error(e.message)
            })
        const businessPartner: BusinessPartner = await new BusinessPartnerRepository().findContactEmployee(purchaseOrder.CardCode!);
        purchaseOrder.ContactPersonList = businessPartner.contactEmployee ?? [];

        return purchaseOrder;
    }

    async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

        // if (payload['DocumentStatus'].includes('bost_Close') || payload['DocumentStatus'] === 'O') {
        //     throw new Error('This Document can not be update');
        // }


        if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", payload);

        return await request('POST', this.url, payload);
    }


    async patch(id: any, payload: any): Promise<any> {
        return await request('PATCH', this.url, payload);
    }


    async delete(id: any): Promise<PurchaseOrder> {
        throw new Error('Method not implemented.');
    }

}