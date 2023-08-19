import Repository from "@/astractions/repository";
import ItemGroup from "@/models/ItemGroup";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class ItemGroupRepository extends Repository<ItemGroup> {
   
    url = '/ItemGroups?$select=GroupName,Number,ItemGroupsWarehouseInfos';
    
    // specific key
    key = 'itemGroups';

    async get<ItemGroup>(query?: string | undefined): Promise<ItemGroup[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const itemGroups = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(itemGroups);
        }

        const itemGroups = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(itemGroups));
        localStorage.setItem(this.key, enc);

        return itemGroups;
    }


 
    find<ItemGroup>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const itemsGroup: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return itemsGroup.find((e: any) => e?.Number == code);
    }


    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<ItemGroup> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<ItemGroup> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<ItemGroup> {
        throw new Error("Method not implemented.");
    }
}