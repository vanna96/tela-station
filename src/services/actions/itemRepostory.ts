import Repository from "@/astractions/repository";
import Item from "@/models/Item";
import request from "@/utilies/request";


export default class itemRepository extends Repository<Item> {
    url = '/Items';

    select = [
        'ItemName',
        'ItemCode',
        'ForeignName',
        "PurchaseVATGroup",
        "SalesVATGroup",
        "UoMGroupEntry",
        "ItemsGroupCode",
        "PurchaseItem",
        "SalesItem",
        "InventoryItem",
        "InventoryUoMEntry",
        "InventoryUOM",
        "DefaultWarehouse",
        "DefaultSalesUoMEntry",
        "DefaultPurchasingUoMEntry",
        "ItemUnitOfMeasurementCollection",
        "Mainsupplier",
        "ItemPrices",
        "ItemType",
        "U_t_re",
        "U_tl_dim1",
        "U_tl_dim2",
    ];

    private static url1 = '/Items';

    selectSale= [
        'ItemName',
        'ItemCode',
        'ForeignName',
        "SalesVATGroup",
        "UoMGroupEntry",
        "SalesItem",
        "DefaultSalesUoMEntry",
        "ItemUnitOfMeasurementCollection",
        "ItemPrices",
        "ItemsGroupCode",
        "ItemType",
        "U_tl_dim1",
        "U_tl_dim2"

    ];
    static select: any;

    async get<Item>(query?: string | undefined): Promise<Item[]> {
        // const response = await request('GET', this.url + + '?$select=' + this.select.join(','))
        const response = await request('GET', this.url + '?$select=' + this.select.join(',') + `&$filter=ItemType eq 'itItems'`)

            .then((res: any) => res?.data?.value)
            .catch((e: Error) => {
                throw new Error(e.message);
            });

        if (!response) return [];


        return response;
    }


    async getSaleItem<Item>(saleQuery?: string | undefined): Promise<Item[]> {
        return await request('GET', this.url + "?$select=" + this.selectSale.join(',') + saleQuery ?? '').then((res: any) => res?.data?.value).catch((e) => {
            throw new Error(e);
        });
    }
        


    public static async getAll<Item>(saleQuery?: string | undefined): Promise<Item[]> {
        const response = await request('GET', this.url1 + '?$select=' + this.select.join(',') + `&$filter=ItemType eq 'itItems'`)
            .then((res: any) => res?.data?.value)
            .catch((e: Error) => {
                throw new Error(e.message);
            });

        if (!response?.data) throw new Error('No Data');
        return response.data?.map((e: any) => new Item(e));
    }

    async find<Item>(id?: any, query?: string | undefined): Promise<any> {
        const response = await request('GET', `${this.url}(${id})`)
            .then((res: any) => res?.data)
            .catch((e: Error) => {
                throw new Error(e.message);
            });
        return new Item(response);
    }


    post(payload: any): Promise<Item> {
        throw new Error("Method not implemented.");
    }


    patch(id: any, payload: any): Promise<Item> {
        throw new Error("Method not implemented.");
    }


    delete(id: any): Promise<Item> {
        throw new Error("Method not implemented.");
    }
}