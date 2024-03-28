import request from "@/utilies/request";

export type TOLineSyncPayloadType = "gi" | "gr";

export type TOLineSyncPayload = {
  LineId: number;
  Type: TOLineSyncPayloadType;
  Synce: number;
  DocNum: number;
};

export const createGIGRTransaction = async (data: any[]) => {
  let transactions: any[] = data;
  return new Promise(async (resolve, reject) => {
    for (let rows of transactions) {
      let TODetail = rows?.DetailLine;
      let lineId = rows?.LineId;
      rows = rows.Data as any[];
      try {
        const goodIssue = rows?.length === 2 ? rows?.at(0) : undefined;
        let goodReceipt = rows?.length === 1 ? rows?.at(0) : rows?.at(1);
        // Create Good Issue
        const goodIssueResponse = await generateGoodIssue(goodIssue);

        await updateSyncTOLine(TODetail, {
          Synce: goodIssueResponse.status !== 201 ? -1 : 1,
          LineId: lineId,
          Type: "gi",
          DocNum: goodIssueResponse?.data?.DocNum,
        });

        if (goodIssueResponse.status !== 201) break;

        //
        // Create Good Receipt
        const goodReceiptResponse = await generateGoodReceipt(
          goodReceipt,
          goodIssueResponse.data
        );

        await updateSyncTOLine(TODetail, {
          Synce: goodReceiptResponse.status !== 201 ? -1 : 1,
          LineId: lineId,
          Type: "gr",
          DocNum: goodReceiptResponse?.data?.DocNum,
        });

        if (goodReceiptResponse.status !== 201) break;

        //
        // Update document reference between good issue and good receupt
        const update = await updateGoodIssue(
          goodIssueResponse?.data?.DocEntry,
          {
            DocumentReferences: [
              {
                RefDocEntr: goodReceiptResponse?.data?.DocEntry,
                RefDocNum: goodReceiptResponse?.data?.DocNum,
                RefObjType: "rot_GoodsReceipt",
                // RefObjType: "rot_SalesOrder",
              },
            ],
          }
        );

        if (update.status !== 201) break;
      } catch (error) {
        console.log(error);
        reject(error);
        break;
      }
    }
    resolve({
      status: 204,
      message: "Good Issue and Good Receipt Release successfully",
    });
  });
};

export type GenerateGIGRReponse = {
  status: any;
  data?: any;
  message?: string;
};

export const generateGoodIssue = (
  payload: any
): Promise<GenerateGIGRReponse> => {
  return new Promise((resolve, reject) => {
    request("POST", "InventoryGenExits", payload)
      .then((response: any) => resolve({ status: 201, data: response?.data }))
      .catch((error: any) => {
        resolve({ status: 400, message: error?.message });
      });
  });
};

export const updateGoodIssue = (
  id: number,
  payload: any
): Promise<GenerateGIGRReponse> => {
  return new Promise((resolve, reject) => {
    request("PATCH", `InventoryGenExits(${id})`, payload)
      .then(async (response: any) => {
        resolve({ status: 201, data: response?.data });
      })
      .catch((error: any) => {
        resolve({ status: 400, message: error?.message });
      });
  });
};

export const updateSyncTOLine = (
  id: number,
  payload: TOLineSyncPayload
): Promise<GenerateGIGRReponse> => {
  return new Promise((resolve, reject) => {
    request("PATCH", `script/test/update_trans_order_synce(${id})`, payload)
      .then((response: any) => resolve({ status: 201, data: response?.data }))
      .catch((error: any) => {
        resolve({ status: 400, message: error?.message });
      });
  });
};

export const generateGoodReceipt = (
  payload: any,
  goodIssue: any
): Promise<GenerateGIGRReponse> => {
  return new Promise((resolve, reject) => {
    try {
      payload["DocumentReferences"] = [
        {
          RefDocEntr: goodIssue?.DocEntry,
          RefDocNum: goodIssue?.DocNum,
          RefObjType: "rot_GoodsIssue",
        },
      ];

      for (let index = 0; index < payload.DocumentLines.length; index++) {
        payload.DocumentLines[index]["LineTotal"] =
          goodIssue?.DocumentLines[index]?.U_tl_ltotal;
        payload.DocumentLines[index]["U_tl_itmcost"] =
          goodIssue?.DocumentLines[index]["U_tl_itmcost"];
        payload.DocumentLines[index]["U_tl_ltotal"] =
          goodIssue?.DocumentLines[index]["U_tl_ltotal"];
      }

      request("POST", "InventoryGenEntries", payload)
        .then((response: any) => resolve({ status: 201, data: response?.data }))
        .catch((error: any) => {
          resolve({ status: 400, message: error?.message });
        });
    } catch (error: any) {
      console.log(error);
      resolve({ status: 400, message: error });
    }
  });
};
