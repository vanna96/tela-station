import Model from './Model';


export default class ItemGroup extends Model {
    id: number | undefined;
    name: string | undefined;
    itemGroupWwarehouseInfos: any[];


    constructor(json: any) {
        super()

        this.id = json['Number']
        this.name = json['GroupName']
        this.itemGroupWwarehouseInfos = json['ItemGroupsWarehouseInfos']
    } 



    toJson(update?: boolean | undefined) {
        throw new Error('Method not implemented.');
    }
}