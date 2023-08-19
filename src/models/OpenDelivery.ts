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
  cardCode?: any;
  cardName?: string;
}

export default class OpenDelivery extends Model {
  id: any;
  cardCode?: any;
  cardName?: string;
  constructor(json: any) {
    super();
    this.id = json['CardCode'];
    this.cardCode = json['CardCode'];
    this.cardName = json['CardName'];
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


}



