import Model from './Model';


export default class DistributionRule extends Model {
    code: string;
    name: string;
    inWhichDimension: number;


    constructor(json:any) {
        super() 

        this.code = json['FactorCode'];
        this.name = json['FactorDescription'];
        this.inWhichDimension = json['InWhichDimension'];
    }


    toJson(update?: boolean | undefined) {
        throw new Error('Method not implemented.');
    }
    
}