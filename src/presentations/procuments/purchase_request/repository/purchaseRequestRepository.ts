import Repository from '@/astractions/repository';
import PurchaseRequest from '@/models/PurchaseRequest';
import request from '@/utilies/request';

export default class PurchaseRequestRepository extends Repository<PurchaseRequest> {

    url: string = '/PurchaseRequests';

    public static documentSerie = {
        Document: "1470000113"
    }

    async get<T>(query?: string): Promise<T[]> {
        const response: any = await request('GET', this.url + query).then((res: any) => {
            const data = res?.data?.value?.map((e: any) => new PurchaseRequest(e));
            return data;
        }).catch((e) => {
            throw new Error(e);
        });

        return response;
    }

    async find<T>(id: any): Promise<any> {
        const purchasRequest = await request('GET', `${this.url}(${id})`).then((res: any) => new PurchaseRequest(res.data))
            .catch((e: Error) => {
                throw new Error(e.message)
            })
        return purchasRequest;
    }

    async documentTotal<T>(query?: string): Promise<number> {
        const response: any = await request('GET', this.url + '/$count' + query).then(async (res: any) => {
            return res.data;
        }).catch((e: Error) => {
            throw new Error(e.message);
        });

        return response;
    }


    async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

        if (isUpdate) return await request('PATCH', this.url + "(" + id + ")", payload);

        return await request('POST', this.url, payload);
    }


    async patch(id: any, payload: any): Promise<any> {
        // return await request('PATCH', this.url, PurchaseRequest.toUpdate(payload));
    }


    async delete(id: any): Promise<PurchaseRequest> {
        throw new Error('Method not implemented.');
    }

}