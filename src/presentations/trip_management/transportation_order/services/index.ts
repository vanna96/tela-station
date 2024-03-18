const data = [
  [
    {
      DocDate: "2024-03-18T06:40:41.702Z",
      DocDueDate: "2024-03-18T06:40:41.702Z",
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
      DocDate: "2024-03-18T06:40:41.740Z",
      DocDueDate: "2024-03-18T06:40:41.740Z",
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
  [
    {
      DocDate: "2024-03-18T06:40:44.498Z",
      DocDueDate: "2024-03-18T06:40:44.498Z",
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
      DocDate: "2024-03-18T06:40:44.499Z",
      DocDueDate: "2024-03-18T06:40:44.499Z",
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
  [
    {
      DocDate: "2024-03-18T06:40:47.021Z",
      DocDueDate: "2024-03-18T06:40:47.021Z",
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
      DocDate: "2024-03-18T06:40:47.021Z",
      DocDueDate: "2024-03-18T06:40:47.021Z",
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
];





export const createGIGRTransaction = () => {
    
}