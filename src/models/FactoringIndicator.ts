import Model from './Model';

export default class Owner extends Model {
    
    code: string;
    name: string;

    
    constructor(json : any) {
        super()

        this.code = json['IndicatorCode']
        this.name = json['IndicatorName']
    }
    
    toJson(update: boolean) {
        throw new Error('Method not implemented.');
    }

}