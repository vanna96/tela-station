import request from "@/utilies/request";

const data = [
  {
    DetailLine: 13,
    LineId: 1,
    Data: [
      {
        DocDate: "2024-03-18T09:38:39.386Z",
        DocDueDate: "2024-03-18T09:38:39.386Z",
        BPL_IDAssignedToInvoice: 1,
        JournalMemo: "2 - Goods Issue ITR",
        DocumentLines: [
          {
            ItemCode: "GSP0022",
            ItemDescription: "វ៉ែនតាសុវត្តិភាព​(3M , V34)",
            WarehouseCode: "WH03",
            Quantity: 1500,
            UoMEntry: 22,
            UoMCode: "Set",
            UseBaseUnits: "tNO",
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: 101,
                Quantity: "1500.0000",
                AllowNegativeQuantity: "tNO",
                SerialAndBatchNumbersBaseLine: -1,
                BaseLineNumber: 0,
              },
            ],
          },
        ],
      },
      {
        DocDate: "2024-03-18T09:38:39.393Z",
        DocDueDate: "2024-03-18T09:38:39.393Z",
        BPL_IDAssignedToInvoice: 1,
        JournalMemo: "2 - Goods Receipt ITR",
        DocumentLines: [
          {
            ItemCode: "GSP0022",
            ItemDescription: "វ៉ែនតាសុវត្តិភាព​(3M , V34)",
            WarehouseCode: "WH03",
            Quantity: 1500,
            UoMEntry: 22,
            UoMCode: "Set",
            UseBaseUnits: "tNO",
            DocumentLinesBinAllocations: [],
          },
        ],
      },
    ],
  },
  {
    DetailLine: 13,
    LineId: 2,
    Data: [
      {
        DocDate: "2024-03-18T09:38:41.855Z",
        DocDueDate: "2024-03-18T09:38:41.855Z",
        BPL_IDAssignedToInvoice: 1,
        JournalMemo: "2 - Goods Issue SO",
        DocumentLines: [
          {
            ItemCode: "FUE0001",
            ItemDescription: "Diesel Euro 5",
            WarehouseCode: "WH03",
            Quantity: 23,
            UoMEntry: 19,
            UoMCode: "L",
            UseBaseUnits: "tNO",
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: 101,
                Quantity: "23.0000",
                AllowNegativeQuantity: "tNO",
                SerialAndBatchNumbersBaseLine: -1,
                BaseLineNumber: 0,
              },
            ],
          },
        ],
      },
      {
        DocDate: "2024-03-18T09:38:41.856Z",
        DocDueDate: "2024-03-18T09:38:41.856Z",
        BPL_IDAssignedToInvoice: 1,
        JournalMemo: "2 - Goods Receipt SO",
        DocumentLines: [
          {
            ItemCode: "FUE0001",
            ItemDescription: "Diesel Euro 5",
            WarehouseCode: "WH03",
            Quantity: 23,
            UoMEntry: 19,
            UoMCode: "L",
            UseBaseUnits: "tNO",
            DocumentLinesBinAllocations: [],
          },
        ],
      },
    ],
  },
  {
    DetailLine: 13,
    LineId: 3,
    Data: [
      {
        DocDate: "2024-03-18T09:38:45.704Z",
        DocDueDate: "2024-03-18T09:38:45.704Z",
        BPL_IDAssignedToInvoice: 1,
        JournalMemo: "2 - Goods Issue SO",
        DocumentLines: [
          {
            ItemCode: "FUE0002",
            ItemDescription: "Regular 92",
            WarehouseCode: "WH03",
            Quantity: 23,
            UoMEntry: 19,
            UoMCode: "L",
            UseBaseUnits: "tNO",
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: 103,
                Quantity: "23.0000",
                AllowNegativeQuantity: "tNO",
                SerialAndBatchNumbersBaseLine: -1,
                BaseLineNumber: 0,
              },
            ],
          },
        ],
      },
      {
        DocDate: "2024-03-18T09:38:45.704Z",
        DocDueDate: "2024-03-18T09:38:45.704Z",
        BPL_IDAssignedToInvoice: 1,
        JournalMemo: "2 - Goods Receipt SO",
        DocumentLines: [
          {
            ItemCode: "FUE0002",
            ItemDescription: "Regular 92",
            WarehouseCode: "WH03",
            Quantity: 23,
            UoMEntry: 19,
            UoMCode: "L",
            UseBaseUnits: "tNO",
            DocumentLinesBinAllocations: [],
          },
        ],
      },
    ],
  },
];

export type TOLineSyncPayloadType = "gi" | "gr";

export type TOLineSyncPayload = {
  LineId: number;
  Type: TOLineSyncPayloadType;
  Synce: number;
};

export const createGIGRTransaction = async () => {
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

        console.log(lineId);
      } catch (error) {
        reject(error);
      }
    }
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
