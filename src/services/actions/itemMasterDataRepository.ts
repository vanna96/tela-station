import Repository from '@/astractions/repository';
import request from '@/utilies/request';
import ItemMasterData from '../../models/ItemMasterData';

export default class ItemMasterDataRepository extends Repository<ItemMasterData> {
    
    url: string = '/Items';
    
    public static documentSerie = {
        Document: "1470000113"
    }
    
    async get<T>(query?: string): Promise<T[]> {
        const response: any = await request('GET', this.url + query).then((res: any) => {
            const data = res?.data?.value?.map((e: any) => new ItemMasterData(e));
            return data;
        }).catch((e) => {
            throw new Error(e);
        });

        return response;
    }

    async find<T>(id: any): Promise<any> {
        const items = await request('GET', `${this.url}(${id})`).then((res: any) => new ItemMasterData(res.data))
            .catch((e: Error) => {
            throw new Error(e.message)
            })
        
        // const businessPartner: BusinessPartner = await new BusinessPartnerRepository().findContactEmployee(purchaseAgreement.cardCode!);

        // purchaseAgreement.email = businessPartner.email;
        // purchaseAgreement.phone = businessPartner.phone;
        // purchaseAgreement.contactPersonList = businessPartner.contactEmployee ?? [];

        return ItemMasterData;
    }



   
    async post(payload: any, isUpdate?: boolean, id?: any): Promise<any> {

        if(isUpdate) return await request('PATCH',  this.url + "('"  + id + "')", ItemMasterData.toUpdate(payload));

        return await request('POST', this.url, ItemMasterData.toCreate(payload));
    }


    async patch(id: any, payload: any): Promise<any> {
         return await request('PATCH',  this.url + "('" + id + "')", ItemMasterData.toUpdate(payload));
    }


    async delete(id: any): Promise<ItemMasterData> {
        throw new Error('Method not implemented.');
    }

    async documentTotal<T>(query?: string): Promise<number> {
        const response: any = await request("GET", this.url + "/$count" + query)
          .then(async (res: any) => {
            return res.data;
          })
          .catch((e: Error) => {
            throw new Error(e.message);
          });
    
        return response;
      }
    
}