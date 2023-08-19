import { dateFormat } from '../utilies';
import Model from './Model';
import { MasterDocument, DocumentLine } from './interface/index';
import moment from 'moment';
import { IContactPersonList } from '../astractions/index';
import { ContactEmployee } from './BusinessParter';
import ShippingTypeRepository from '../services/actions/shippingTypeRepository';
import PaymentTermTypeRepository from '../services/actions/paymentTermTypeRepository';
import OwnerRepository from '../services/actions/ownerRepository';
import { getValueDocumentStatus } from '@/constants';

export interface WarehousesProps {
  id: any;
  docEntry?: any;
  u_TRANSPROUTE?: string;
  u_TRANSPVEHICLE?: string;
  driver?: string;
  u_TRANSPSTATUS?: string;
}

export default class OpenTransportation extends Model {
  id: any;
  docEntry?: any;
  u_TRANSPROUTE?: string;
  u_TRANSPVEHICLE?: string;
  driver?: string;
  u_TRANSPSTATUS?: string;
  constructor(json: any) {
    super();
    this.id = json['DocEntry'];
    this.docEntry = json['DocEntry'];
    this.u_TRANSPROUTE = json['U_TRANSPROUTE'];
    this.u_TRANSPVEHICLE = json['U_TRANSPVEHICLE'];
    this.driver = json['Driver'];
    this.u_TRANSPSTATUS = json['U_TRANSPSTATUS'];
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


}



