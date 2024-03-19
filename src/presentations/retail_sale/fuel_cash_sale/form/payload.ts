const payload = {
    "SaleDocEntry": 15,//doc number of fuel cash sale, lube case sale or lPG case sale,
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
    "U_tl_whsdesc": "WHC", //remark : warehouse headoffice
    "CashAccount": "110101", //fixed
    "CashAccountFC": "110103", //luy khmer,
    "TransferAccount": "110101", //fixed bank
    "CheckAccount": "110101", // fixed
    "CouponAccount": "110101", // get cash account USD 
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
            // "CounNum": "2324234"
        },

    ],

    "DocumentLines": [ // change from CashSales to DocumentLines
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
                }
            ]
        }
    ],


}