import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";

export const getDeliveryToSaleOrder = async (id :number) :Promise<any> => {
   return new Promise(async (resolve, reject) => {
     await  request("GET", `Orders(${id})`)
    .then(async (res: any) => {
      const data: any = res?.data;
      // vendor
      const vendor: any = await request(
        "GET",
        `/BusinessPartners('${data?.CardCode}')`
      )
        .then((res: any) => new BusinessPartner(res?.data, 0))
        .catch((err: any) => console.log(err));

      // attachment
      let disabledFields: any = {
        CurrencyType: true,
      };

      let  state = {
        ...data,
        vendor,
        warehouseCode: data.U_tl_whsdesc,
        lob: data.U_tl_arbusi,
        Currency: data.DocCurrency,

        Items: await Promise.all(
          (data?.DocumentLines || []).map(async (item: any) => {
            let apiResponse: any;

            if (item.ItemCode) {
              try {
                const response:any = await request(
                  "GET",
                  `/Items('${item.ItemCode}')?$select=UoMGroupEntry,InventoryUoMEntry,ItemPrices`
                );

                apiResponse = response.data;
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            }

            const uomGroups: any =
              await new UnitOfMeasurementGroupRepository().get();

            const uoms = await new UnitOfMeasurementRepository().get();
            const uomGroup: any = uomGroups.find(
              (row: any) => row.AbsEntry === apiResponse.UoMGroupEntry
            );

            let uomLists: any[] = [];
            uomGroup?.UoMGroupDefinitionCollection?.forEach((row: any) => {
              const itemUOM = uoms.find( (record: any) => record?.AbsEntry === row?.AlternateUoM);
              if (itemUOM)
                uomLists.push(itemUOM);
            });

            //
            item.ItemPrices === apiResponse.ItemPrices;

            return {
              ItemCode: item.ItemCode || null,
              ItemName: item.ItemDescription || item.Name || null,
              Quantity: item.Quantity || null,
              InventoryUoMEntry: apiResponse.InventoryUoMEntry,
              UnitPrice:
                item.GrossPrice / (1 + item.TaxPercentagePerRow / 100),
              Discount: item.DiscountPercent || 0,
              GrossPrice: item.GrossPrice,
              TotalGross: item.GrossTotal,
              TotalUnit: item.LineTotal,
              LineTotal: item.GrossTotal,
              DiscountPercent: item.DiscountPercent || 0,
              VatGroup: item.VatGroup,
              UoMEntry: item.UomAbsEntry || null,
              WarehouseCode: item?.WarehouseCode || data?.U_tl_whsdesc,
              UomAbsEntry: item?.UoMEntry,
              VatRate: item.TaxPercentagePerRow,
              UomLists: uomLists,
              ItemPrices: apiResponse.ItemPrices,
              ExchangeRate: data?.DocRate || 1,
              JournalMemo: data?.JournalMemo,
              COGSCostingCode: item?.COGSCostingCode,
              COGSCostingCode2: item?.COGSCostingCode2,
              COGSCostingCode3: item?.COGSCostingCode3,
              CurrencyType: "B",
              DocumentLinesBinAllocations: item.DocumentLinesBinAllocations,
              vendor,
              warehouseCode: data?.U_tl_whsdesc,
              DocDiscount: data?.DiscountPercent,
              BPAddresses: vendor?.bpAddress?.map(
                ({ addressName, addressType }: any) => {
                  return {
                    addressName: addressName,
                    addressType: addressType,
                  };
                }
              ),
              // AttachmentList,
              disabledFields,
              isStatusClose: data?.DocumentStatus === "bost_Close",
              RoundingValue:
                data?.RoundingDiffAmountFC || data?.RoundingDiffAmount,
              Rounding: (data?.Rounding == "tYES").toString(),
              Edit: true,
              // PostingDate: data?.DocDate,
              // DueDate: data?.DocDueDate,
              // DocumentDate: data?.TaxDate,
            };
          })
        ),
      };
      resolve(state)
    })
    .catch((err: any) => reject(err))
   })
}