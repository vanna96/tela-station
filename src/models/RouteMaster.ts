
import Model from './Model';

export interface RouteMasterProps {
  id: any;
  U_RMCODE: any;
  U_RMNAME: any;
  U_RMBASEST: any;
  CreateDate: any;
  CreateTime: any;
  UpdateDate: any;
  UpdateTime: any;
  id__: any;
}

export default class RouteMaster extends Model {
  u_RMCODE: string | undefined;
  u_RMNAME: string | undefined;
  u_RMBASEST: string | undefined;
  createDate: string | undefined;
  createTime: string | undefined;
  updateDate: string | undefined;
  updateTime: string | undefined;
  index: number ;
  id: number | undefined;
  constructor(json: any) {
    super();
    this.id = json['U_RMCODE'];
    this.index = json['id__']
    this.u_RMCODE = json['U_RMCODE'];
    this.u_RMNAME = json['U_RMNAME'];
    this.u_RMBASEST = json['U_RMBASEST'];
    this.createDate = json['CreateDate'];
    this.createTime = json['CreateTime'];
    this.updateDate = json['UpdateDate'];
    this.updateTime = json['UpdateTime'];
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


  public static toCreate(json: any) {
    return {
      U_RMCODE: json['u_RMCODE'],
      U_RMNAME: json['u_RMNAME'],
      U_RMBASEST: json['u_RMBASEST'],

    };
  }


  public static toUpdate(json: any) {
    return {
      U_RMCODE: json['u_RMCODE'],
      U_RMNAME: json['u_RMNAME'],
      U_RMBASEST: json['u_RMBASEST'],
    };
  }

}



