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
  warehouseCode?: any;
  warehouseName?: string;
  inactive?: boolean;
  enableBinLocation?: boolean;
  street?: string;
  streetNo?: string;
  buildingFloorRoom?: string;
  block?: string;
  zipCode?: string;
  city?: string;
  county?: string;
  country?: string;
  state?: string;
  federalTaxID?: string;
  globalLocationNumber?: string;
  taxGroup?: string;
}

export default class Warehouses extends Model {
  id: any;
  warehouseCode?: any;
  warehouseName?: string;
  inactive?: boolean;
  enableBinLocation?: boolean;
  street?: string;
  streetNo?: string;
  buildingFloorRoom?: string;
  block?: string;
  zipCode?: string;
  city?: string;
  county?: string;
  country?: string;
  state?: string;
  federalTaxID?: string;
  globalLocationNumber?: string;
  taxGroup?: string;
  constructor(json: any) {
    super();
    this.id = json['WarehouseCode'];
    this.warehouseCode = json['WarehouseCode'];
    this.warehouseName = json['WarehouseName'];
    this.enableBinLocation = json['EnableBinLocations'];
    this.inactive = json['Inactive'];
    this.street = json['Street'];
    this.streetNo = json['StreetNo'];
    this.buildingFloorRoom = json['BuildingFloorRoom'];
    this.block = json['Block'];
    this.zipCode = json['ZipCode'];
    this.city = json['City'];
    this.county = json['County'];
    this.country = json['Country'];
    this.state = json['State'];
    this.federalTaxID = json['FederalTaxID'];
    this.globalLocationNumber = json['GlobalLocationNumber'];
    this.taxGroup = json['TaxGroup'];
  }

  toJson(update: boolean) {
    throw new Error('Method not implemented.');
  }


  public static toCreate(json: any) {
    return {
      "WarehouseCode": json['warehouseCode'],
      "WarehouseName": json['warehouseName'],
      // "EnableBinLocation": json['enableBinLocation'],
      // "Inactive": json['inactive'],
      "Street": json['street'],
      "StreetNo": json['streetNo'],
      "BuildingFloorRoom": json['buildingFloorRoom'],
      "Block": json['block'],
      "ZipCode": json['zipCode'],
      "City": json['city'],
      "County": json['county'],
      "Country": json['country'],
      "State": json['state'],
      "FederalTaxID": json['federalTaxID'],
      "GlobalLocationNumber": json['globalLocationNumber'],
      "TaxGroup": json['taxGroup'],
    };
  }


  public static toUpdate(json: any) {
    return {
      "WarehouseCode": json['warehouseCode'],
      "WarehouseName": json['warehouseName'],
      // "EnableBinLocation": json['enableBinLocation'],
      // "Inactive": json['inactive'],
      "Street": json['street'],
      "StreetNo": json['streetNo'],
      "BuildingFloorRoom": json['buildingFloorRoom'],
      "Block": json['block'],
      "ZipCode": json['zipCode'],
      "City": json['city'],
      "County": json['county'],
      "Country": json['country'],
      "State": json['state'],
      "FederalTaxID": json['federalTaxID'],
      "GlobalLocationNumber": json['globalLocationNumber'],
      "TaxGroup": json['taxGroup'],
    };
  }

}



