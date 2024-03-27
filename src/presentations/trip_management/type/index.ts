export type TOStatus = "I" | "P" | "S" | "D" | "R" | "CM" | "C";

export type POSTTransporationOrder = {
  U_DocDate: string;
  U_Status: TOStatus | undefined;
  DocNum?: number | undefined | null;
  Series?: number | undefined | null;
  U_Driver?: string | undefined;
  U_Vehicle?: string | undefined;
  U_VehicleName?: string | undefined;
  U_Route?: string | undefined;
  U_BaseStation?: string | undefined;
  U_Cancelled?: string | undefined;
  U_Fuel?: string | undefined;
  U_FuelAmount?: number | undefined;
  U_FuelRemark?: number | undefined;
  U_DispatchDate?: string | undefined;
  U_CompletedDate?: string | undefined;
  TL_TO_COMPARTMENTCollection: any[];
  TL_TO_EXPENSECollection: any[];
  TL_TO_ORDERCollection: TOCollections[];
};

export type TOCollections = {
  DocEntry: number;
  U_DocNum: null;
  U_Terminal: null;
  U_TotalQuantity: null;
  U_BPLId: null;
  U_BPLName: null;
  U_Type: "S";
  U_StopCode: string | undefined;
  U_Description: string | undefined;
  U_SourceDocEntry: any;
  U_TotalItem: any;
  U_TOAbsEntry: 201;
  U_Order: number;
  TL_TO_DETAIL_ROWCollection: ChildTOCollection[];
};

export type ChildTOCollection = {
  U_LineId: number | undefined;
  VisOrder: 0;
  U_DocType: "S";
  U_DocNum: any;
  U_SourceDocEntry: any;
  U_ShipToCode: any;
  U_ShipToAddress: any;
  U_ItemCode: any;
  U_ItemName: any;
  U_DeliveryDate: any;
  U_Quantity: any;
  U_Status: "O";
  U_UomCode: any;
  U_UomAbsEntry: any;
  U_Order: number;
};
