const payload = {
    "SANumber": "123456789",//doc number of fuel cash sale, lube case sale or lPG case sale,
    "ToWarehouse": "WH02",// to warehouse take from pump warehouse
    "InvoiceSeries": 7638,
    "IncomingSeries": 183,
    "DocDate": "2024-02-15T00: 00: 00Z",
    "DocCurrency": "USD",
    "DocRate": "4000.0",
    "CardCode": "20000001",
    "CardName": "General Customer",
    "DiscountPercent": 0.0,
    "BPL_IDAssignedToInvoice": 1,
    "U_tl_whsdesc": "WH03",
    "CashAccount": "110101",
    "TransferAccount": "110101",
    "CheckAccount": "110101",
    "CouponAccount": "110101",
    "Remarks": "",
   
    "IncomingPayment": [
        {
            "Type": "Cash",
            "DocCurrency": "KHR",
            "Amount": 80000
        },
        {
            "Type": "Cash",
            "DocCurrency": "KHR",
            "Amount": 10000
        },
        {
            "Type": "Transfer",
            "DocCurrency": "KHR",
            "Amount": 10000
        },
        {
            "Type": "Cash",
            "DocCurrency": "USD",
            "Amount": 20
        },
        {
            "Type": "Transfer",
            "DocCurrency": "USD",
            "Amount": 5
        },
        {
            "Type": "Check",
            "DocCurrency": "USD",
            "DueDate": "",
            "Amount": 5,
            "Bank": "ABA",
            "CheckNum": "2324234"
        }
    ],
    "IncomingPaymentCoupon": [
        {
            "Type": "Cash",
            "DocCurrency": "USD",
            "DueDate": "",
            "Amount": 25,
            "CounNum": "2324234"
        },
        {
            "Type": "Cash",
            "DocCurrency": "KHR",
            "DueDate": "",
            "Amount": 100000,
            "CounNum": "2324234"
        }
    ],
    "StockAllocation": [
        {
            "ItemCode": "FUE0001",
            "Quantity": 2.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 138,
            "BranchCode": 2,
            "WarehouseCode": "ST001",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 138,
                    "Quantity": 2.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        },
        {
            "ItemCode": "FUE0001",
            "Quantity": 1.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 277,
            "BranchCode": 19,
            "WarehouseCode": "ST001",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 277,
                    "Quantity": 1.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ],
    "CardCount": [
        {
            "ItemCode": "FUE0001-01",
            "Quantity": 10.0,
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 101,
            "WarehouseCode": "WH03",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 101,
                    "Quantity": 1.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ],

    "CashSale": [
        {
            "ItemCode": "FUE0001",
            "Quantity": 1.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 101,
            "WarehouseCode": "WH03",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 101,
                    "Quantity": 1.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ],
    "Partnership": [
        {
            "ItemCode": "FUE0001",
            "Quantity": 1.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 101,
            "WarehouseCode": "WH03",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 101,
                    "Quantity": 1.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ],

    "StockTransfer": [
        {
            "ItemCode": "FUE0001",
            "Quantity": 3.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 101,
            "WarehouseCode": "WH03",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 101,
                    "Quantity": 3.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ],
    "OwnUsage": [
        {
            "ItemCode": "FUE0001",
            "Quantity": 1.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 101,
            "WarehouseCode": "WH03",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 101,
                    "Quantity": 1.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ],
    "TelaCard": [
        {
            "ItemCode": "FUE0001",
            "Quantity": 1.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19,
            "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 101,
            "WarehouseCode": "WH03",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 101,
                    "Quantity": 1.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ],

    "PumpTest": [
        {
            "ItemCode": "FUE0001",
            "Quantity": 10.0,
            "GrossPrice": 100,
            "DiscountPercent": 0,
            "TaxCode": "VO10",
            "UoMCode": "L",
            "UoMEntry": 19, "LineOfBussiness": "201001", // item.LineOfBussiness
            "RevenueLine": "202004", // item.RevenueLine
            "ProductLine": "203004", // item.ProductLine
            "BinAbsEntry": 101,
            "WarehouseCode": "WH03",
            "DocumentLinesBinAllocations": [
                {
                    "BinAbsEntry": 101,
                    "Quantity": 1.0,
                    "AllowNegativeQuantity": "tNO",
                    "BaseLineNumber": 0
                }
            ]
        }
    ]
}