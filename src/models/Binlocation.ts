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

export interface BinlocationProps {
  id: any;
  absEntry?: any;
  warehouse?: number;
  binCode?: boolean;
}

export default class Binlocation extends Model {
  id: any;
  absEntry?: any;
  warehouse?: number;
  binCode?: boolean;
 
  constructor(json: any) {
    super();
    this.id = json['AbsEntry'];
    this.absEntry = json['AbsEntry'];
    this.warehouse = json['Warehouse'];
    this.binCode = json['BinCode'];
  
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


  public static toCreate(json: any) {
    return {
      "AbsEntry": json['absEntry'],
      "SpecificItem": json['specificItem'],
      "Warehouse": json['warehouse'],
      "RestrictionReason": json['restrictionReason'],
      "SpecificUoMGroup": json['specificUoMGroup'],
      "BatchRestrictions": json['batchRestrictions'],
      "BinCode": json['binCode'],
      "Inactive": json['inactive'],
      "Sublevel1": json['sublevel1'],
      "Sublevel2": json['sublevel2'],
      "Sublevel3": json['sublevel3'],
      "Description": json['description'],
      "AlternativeSortCode": json['alternativeSortCode'],
      "BarCode": json['barCode'],
      "MinimumQty": json['minimumQty'],
      "MaximumQty": json['maximumQty'],
      "MaximumWeight": json['maximumWeight'],
      "RestrictedItemType": json['restrictedItemType'],
      "RestrictedUoMType": json['restrictedUoMType'],
      "RatchRestrictions": json['ratchRestrictions'],
      "RestrictedTransType": json['restrictedTransType'],
      "SpecificItemGroup": json['specificItemGroup'],
    };
  }


  public static toUpdate(json: any) {
    return {
      "AbsEntry": json['absEntry'],
      "SpecificUoMGroup": json['specificUoMGroup'],
      "SpecificItem": json['specificItem'],
      "Warehouse": json['warehouse'],
      "RestrictionReason": json['restrictionReason'],
      "BatchRestrictions": json['batchRestrictions'],
      "BinCode": json['binCode'],
      "Inactive": json['inactive'],
      "Sublevel1": json['sublevel1'],
      "Sublevel2": json['sublevel2'],
      "Sublevel3": json['sublevel3'],
      "Description": json['description'],
      "AlternativeSortCode": json['alternativeSortCode'],
      "BarCode": json['barCode'],
      "MinimumQty": json['minimumQty'],
      "MaximumQty": json['maximumQty'],
      "MaximumWeight": json['maximumWeight'],
      "RestrictedItemType": json['restrictedItemType'],
      "RestrictedUoMType": json['restrictedUoMType'],
      "RatchRestrictions": json['ratchRestrictions'],
      "RestrictedTransType": json['restrictedTransType'],
      "SpecificItemGroup": json['specificItemGroup'],
    };
  }

}



