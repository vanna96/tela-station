
import Model from './Model';
import { DocumentLine } from './interface';


export default class Vehicel extends Model {
  id: any;
  u_VEHCODE?: any;
  u_VEHDRIVER?: string;
  u_VEHNAME?: string;
  u_VEHTYPE?: string;
  u_VEHMAKE?: string;
  u_VEHMODEL?: string;
  u_VEHVINNO?: number;
  u_VEHPLATENO?: number;
  u_VEHEXPDATE?: string;
  u_VEHNEXTMAINT?: string;
  u_VEHOPLICED?: string;
  u_VEHSTAGING?: string;
  u_VEHLENGTH?: string;
  u_VEHWIDTH?: string;
  u_VEHWEIGHT?: string;
  u_VEHVOLUME?: string;
  u_VEHHEIGHT?:string
 
  items: VehicelDocumentLine[];

  constructor(json: any) {
    super();
    this.id = json['U_VEHCODE'];
    this.u_VEHCODE = json['U_VEHCODE'];
    this.u_VEHDRIVER = json['U_VEHDRIVER'];
    this.u_VEHNAME = json['U_VEHNAME'];
    this.u_VEHTYPE = json['U_VEHTYPE'];
    this.u_VEHMAKE = json['U_VEHMAKE'];
    this.u_VEHMODEL = json['U_VEHMODEL'];
    this.u_VEHVINNO = json['U_VEHVINNO'];
    this.u_VEHEXPDATE = json['U_VEHEXPDATE'];
    this.u_VEHNEXTMAINT = json['U_VEHNEXTMAINT'];
    this.u_VEHOPLICED = json['U_VEHOPLICED'];
    this.u_VEHSTAGING = json['U_VEHSTAGING'];
    this.u_VEHLENGTH = json['U_VEHLENGTH'];
    this.u_VEHWIDTH = json['U_VEHWIDTH'];
    this.u_VEHWEIGHT = json['U_VEHWEIGHT'];
    this.u_VEHVOLUME = json['U_VEHVOLUME'];
    this.u_VEHHEIGHT = json['U_VEHHEIGHT']
    this.items = json['BIZ_LOG_VEH1Collection']?.map((e:any)=>new VehicelDocumentLine(e))
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


  public static toCreate(json: any) {
    return {
      "U_VEHCODE": json['u_VEHCODE'],
      "U_VEHDRIVER": json['u_VEHDRIVER'],
      "U_VEHNAME": json['u_VEHNAME'],
      "U_VEHTYPE": json['u_VEHTYPE'],
      "U_VEHMAKE": json['u_VEHMAKE'],
      "U_VEHMODEL": json['u_VEHMODEL'],
      "U_VEHVINNO": json['u_VEHVINNO'],
      "U_VEHEXPDATE": json['u_VEHEXPDATE'],
      "U_VEHNEXTMAINT": json['u_VEHNEXTMAINT'],
      "U_VEHOPLICED": json['u_VEHOPLICED'],
      "U_VEHSTAGING": json['u_VEHSTAGING'],
      "U_VEHLENGTH": json['u_VEHLENGTH'],
      "U_VEHWEIGHT": json['u_VEHWEIGHT'],
      "U_VEHVOLUME": json['u_VEHVOLUME'],
      "BIZ_LOG_VEH1Collection": json['items']?.map((e: any) => VehicelDocumentLine.toCreate(e))

    };
  }


  public static toUpdate(json: any) {
    return {
      "U_VEHCODE": json['u_VEHCODE'],
      "U_VEHDRIVER": json['u_VEHDRIVER'],
      "U_VEHNAME": json['u_VEHNAME'],
      "U_VEHTYPE": json['u_VEHTYPE'],
      "U_VEHMAKE": json['u_VEHMAKE'],
      "U_VEHMODEL": json['u_VEHMODEL'],
      "U_VEHVINNO": json['u_VEHVINNO'],
      "U_VEHEXPDATE": json['u_VEHEXPDATE'],
      "U_VEHNEXTMAINT": json['u_VEHNEXTMAINT'],
      "U_VEHOPLICED": json['u_VEHOPLICED'],
      "U_VEHSTAGING": json['u_VEHSTAGING'],
      "U_VEHLENGTH": json['u_VEHLENGTH'],
      "U_VEHWEIGHT": json['u_VEHWEIGHT'],
      "U_VEHVOLUME": json['u_VEHVOLUME'],
      "BIZ_LOG_VEH1Collection": json['items']?.map((e: any) => VehicelDocumentLine.toCreate(e))

    };
  }

}


export class VehicelDocumentLine extends Model implements DocumentLine {
  u_VEHCOMPNO?: number;
  u_VEHCOMPVO?: number;
  u_VEHCOMPHA?: number;

  constructor(json: any) {
    super();
    this.u_VEHCOMPNO = json['U_VEHCOMPNO'];
    this.u_VEHCOMPVO = json['U_VEHCOMPVO'];
    this.u_VEHCOMPHA = json['U_VEHCOMPHA'];
  }


  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


  public static toCreate(json: any) {

    let body = {
      "U_VEHCOMPNO": json["u_VEHCOMPNO"],
      "U_VEHCOMPVO": json['u_VEHCOMPVO'],
      "U_VEHCOMPHA": json["u_VEHCOMPHA"],
    };

    return body;
  }
}
