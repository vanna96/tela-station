
import Model from './Model';
export default class TransportationOrder extends Model {
  id: any;
  docEntry: any
  docNum: any
  period: any
  instance: any
  series: any
  handwrtten: any
  canceled: any
  object: any
  logInst: any
  userSign: any
  transfered: any
  status: any
  createDate: any
  createTime: any
  updateDate: any
  updateTime: any
  dataSource: any
  requestStatus: any
  creator: any
  remark: any
  u_TRANSPNUM: any
  u_TRANSPVEHICLE: any
  u_TRANSPDRIVER: any
  u_TRANSPROUTE: any
  u_TRANSPSTATUS: any
  u_TRANSPDREFT: any
  u_TRANSPDISPBY: any
  u_TRANSPDISPDATE: any
  u_TRANSPDISPTIME: any
  driver: any
  id__: any
  constructor(json: any) {
    super();
    this.id = json['DocNum'];
    this.docEntry = json['DocEntry']
    this.docNum = json['DocNum']
    this.period = json['Period']
    this.instance = json['Instance']
    this.series = json['Series']
    this.handwrtten = json['Handwrtten']
    this.canceled = json['Canceled']
    this.object = json['Object']
    this.logInst = json['LogInst']
    this.userSign = json['UserSign']
    this.transfered = json['Transfered']
    this.status = json['status']
    this.createDate = json['CreateDate']
    this.createTime = json['CreateTime']
    this.updateDate = json['UpdateDate']
    this.updateTime = json['UpdateTime']
    this.dataSource = json['DataSource']
    this.requestStatus = json['RequestStatus']
    this.creator = json['Creator']
    this.remark = json['Remark']
    this.u_TRANSPNUM = json['U_TRANSPNUM']
    this.u_TRANSPVEHICLE = json['U_TRANSPVEHICLE']
    this.u_TRANSPDRIVER = json['U_TRANSPDRIVER']
    this.u_TRANSPROUTE = json['U_TRANSPROUTE']
    this.u_TRANSPSTATUS = json['U_TRANSPSTATUS']
    this.u_TRANSPDREFT = json['U_TRANSPDREFT']
    this.u_TRANSPDISPBY = json['U_TRANSPDISPBY']
    this.u_TRANSPDISPDATE = json['U_TRANSPDISPDATE']
    this.u_TRANSPDISPTIME = json['U_TRANSPDISPTIME']
    this.driver = json['Driver']
    this.id__ = json['id__']
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


  public static toCreate(json: any) {
    return {
      //  'DocNum' : json['id'],;
     'DocEntry' : json['docEntry'],
     'DocNum' : json['docNum'],
     'Period' : json['period'],
     'Instance' : json['instance'],
     'Series' : json['series'],
     'Handwrtten' : json['handwrtten'],
     'Canceled' : json['canceled'],
     'Object' : json['object'],
     'LogInst' : json['logInst'],
     'UserSign' : json['userSign'],
     'Transfered' : json['transfered'],
     'status' : json['status'],
     'CreateDate' : json['createDate'],
     'CreateTime' : json['createTime'],
     'UpdateDate' : json['updateDate'],
     'UpdateTime' : json['updateTime'],
     'DataSource' : json['dataSource'],
     'RequestStatus' : json['requestStatus'],
     'Creator' : json['creator'],
     'Remark' : json['remark'],
     'U_TRANSPNUM' : json['u_TRANSPNUM'],
     'U_TRANSPVEHICLE' : json['u_TRANSPVEHICLE'],
     'U_TRANSPDRIVER' : json['u_TRANSPDRIVER'],
     'U_TRANSPROUTE' : json['u_TRANSPROUTE'],
     'U_TRANSPSTATUS' : json['u_TRANSPSTATUS'],
     'U_TRANSPDREFT' : json['u_TRANSPDREFT'],
     'U_TRANSPDISPBY' : json['u_TRANSPDISPBY'],
     'U_TRANSPDISPDATE' : json['u_TRANSPDISPDATE'],
     'U_TRANSPDISPTIME' : json['u_TRANSPDISPTIME'],
     'Driver' : json['driver'],
    //  'id__' : json['id__'],
    };
  }


  public static toUpdate(json: any) {
    return {
      'DocEntry' : json['docEntry'],
      'DocNum' : json['docNum'],
      'Period' : json['period'],
      'Instance' : json['instance'],
      'Series' : json['series'],
      'Handwrtten' : json['handwrtten'],
      'Canceled' : json['canceled'],
      'Object' : json['object'],
      'LogInst' : json['logInst'],
      'UserSign' : json['userSign'],
      'Transfered' : json['transfered'],
      'status' : json['status'],
      'CreateDate' : json['createDate'],
      'CreateTime' : json['createTime'],
      'UpdateDate' : json['updateDate'],
      'UpdateTime' : json['updateTime'],
      'DataSource' : json['dataSource'],
      'RequestStatus' : json['requestStatus'],
      'Creator' : json['creator'],
      'Remark' : json['remark'],
      'U_TRANSPNUM' : json['u_TRANSPNUM'],
      'U_TRANSPVEHICLE' : json['u_TRANSPVEHICLE'],
      'U_TRANSPDRIVER' : json['u_TRANSPDRIVER'],
      'U_TRANSPROUTE' : json['u_TRANSPROUTE'],
      'U_TRANSPSTATUS' : json['u_TRANSPSTATUS'],
      'U_TRANSPDREFT' : json['u_TRANSPDREFT'],
      'U_TRANSPDISPBY' : json['u_TRANSPDISPBY'],
      'U_TRANSPDISPDATE' : json['u_TRANSPDISPDATE'],
      'U_TRANSPDISPTIME' : json['u_TRANSPDISPTIME'],
      'Driver' : json['driver'],
    };
  }

}



