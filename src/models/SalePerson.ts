import Model from "./Model";


export default class SalePerson extends Model {

    code: number | undefined | null;
    name: string | undefined | null;
    

    constructor(json: any) {
        super();

        this.code = json['SalesEmployeeCode'];
        this.name = json['SalesEmployeeName'];
    }


    toJson(update?: boolean | undefined) {
        throw new Error("Method not implemented.");
    }
}