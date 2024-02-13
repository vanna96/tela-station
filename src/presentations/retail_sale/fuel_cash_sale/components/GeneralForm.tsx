import React, { useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCookies } from "react-cookie";
import VendorByBranch from "@/components/input/VendorByBranch";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import DispenserAutoComplete from "@/components/input/DispenserAutoComplete";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import itemRepository from "@/services/actions/itemRepostory";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  handlerChangeObject: (obj: any) => void;
}

const fetchDispenserData = async (pump: string) => {
  const res = await request("GET", `TL_Dispenser('${pump}')`);
  return res.data;
};

const fetchItemPrice = async (itemCode: string) => {
  try {
    const res = await request(
      "GET",
      `/Items('${itemCode}')?$select=ItemName,ItemPrices`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching item details:", error);
    return null;
  }
};

export default function GeneralForm({
  data,
  handlerChange,
  handlerChangeObject,
  edit,
}: IGeneralFormProps) {
  const [cookies] = useCookies(["user"]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const userData = cookies.user;

  const BPL = parseInt(data?.U_tl_bplid) || (cookies.user?.Branch <= 0 && 1);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const filteredSeries = data?.seriesList?.filter(
    (series: any) =>
      series?.BPLID === BPL && parseInt(series.PeriodIndicator) === year
  );

  const seriesSO =
    data.seriesList?.find((series: any) => series.BPLID === BPL)?.Series || "";

  // if (filteredSeries[0]?.NextNumber && data) {
  //   data.DocNum = filteredSeries[0]?.NextNumber;
  // }
  console.log(data);
  console.log(data.U_tl_pump);
  async function getPriceListNum(CardCode: any) {
    try {
      const result = await new BusinessPartnerRepository().find(CardCode);
      return result?.PriceListNum;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const globalPriceListNum = getPriceListNum(data.U_tl_cardcode); // Removed an extra closing parenthesis here
  if (data.vendor) {
    data.PriceList = data.vendor.priceLists;
  }

  console.log(data.PriceList);

  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>

      <div className="grid grid-cols-12 ">
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Branch
              </label>
            </div>
            <div className="col-span-3">
              <BranchAutoComplete
                BPdata={userData?.UserBranchAssignment}
                onChange={(e) => handlerChange("U_tl_bplid", e)}
                value={BPL}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Pump <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <DispenserAutoComplete
                value={data?.U_tl_pump}
                isStatusActive
                branch={parseInt(data?.U_tl_bplid) ?? BPL}
                pumpType="Oil"
                // onChange={async (e: any) => {
                //   const dispenserData = await fetchDispenserData(e);

                //   handlerChangeObject({
                //     U_tl_pump: e,

                //     stockAllocationData:
                //       dispenserData?.TL_DISPENSER_LINESCollection?.filter(
                //         (e: any) =>
                //           e.U_tl_status === "Initialized" ||
                //           e.U_tl_status === "Active"
                //       )?.map((item: any) => ({
                //         U_tl_bplid: data.U_tl_bplid,
                //         U_tl_itemcode: item.U_tl_itemnum,
                //         U_tl_itemname: item.U_tl_desc,
                //         U_tl_qtyaloc: item.U_tl_qtyaloc,
                //         U_tl_qtycon: item.U_tl_qtycon,
                //         U_tl_qtyopen: item.U_tl_qtyopen,
                //         U_tl_remark: item.U_tl_remark,
                //         U_tl_uom: item.U_tl_uom,
                //         // ItemPrices: item.ItemPrices,
                //         // ItemPrices: new itemRepository().find(
                //         //   `'${item.U_tl_itemnum}'`
                //         // ),
                //       })),
                //     nozzleData:
                //       dispenserData?.TL_DISPENSER_LINESCollection?.filter(
                //         (e: any) =>
                //           e.U_tl_status === "Initialized" ||
                //           e.U_tl_status === "Active"
                //       )?.map((item: any) => ({
                //         U_tl_nozzlecode: item.U_tl_pumpcode,
                //         U_tl_itemcode: item.U_tl_itemnum,
                //         U_tl_itemname: item.U_tl_desc,
                //         U_tl_uom: item.U_tl_uom,
                //         U_tl_nmeter: item.U_tl_nmeter,
                //         // U_tl_upd_meter: item.U_tl_ometer,
                //         U_tl_ometer: item.U_tl_upd_meter,
                //         U_tl_cmeter: item.U_tl_cmeter,
                //         U_tl_reg_meter: item.U_tl_reg_meter,
                //         U_tl_cardallow: item.U_tl_cardallow,
                //         U_tl_cashallow: item.U_tl_cashallow,
                //         U_tl_ownallow: item.U_tl_ownallow,
                //         U_tl_partallow: item.U_tl_partallow,
                //         U_tl_pumpallow: item.U_tl_pumpallow,
                //         U_tl_stockallow: item.U_tl_stockallow,
                //         U_tl_totalallow: item.U_tl_totalallow,
                //         ItemPrice: "",
                //       })),
                //   });
                // }}
                onChange={async (e: any) => {
                  const dispenserData = await fetchDispenserData(e);

                  // Fetch item details and prices for each item in the dispenser data
                  const itemsWithPricesPromises =
                    dispenserData.TL_DISPENSER_LINESCollection.filter(
                      (line: any) =>
                        line.U_tl_status === "Initialized" ||
                        line.U_tl_status === "Active"
                    ).map(async (line: any) => {
                      const itemDetails = await fetchItemPrice(
                        line.U_tl_itemnum
                      );
                      const price = itemDetails?.ItemPrices?.find(
                        (priceDetail: any) =>
                          priceDetail.PriceList === data.PriceList
                      )?.Price;

                      // Return the original line data with added item name and price
                      return {
                        ...line,
                        ItemName: itemDetails?.ItemName, // Add the fetched item name
                        ItemPrice: price, // Add the fetched price
                      };
                    });

                  const itemsWithPrices = await Promise.all(
                    itemsWithPricesPromises
                  );

                  console.log(itemsWithPrices);

                  // Prepare the stockAllocationData and nozzleData with the fetched item details
                  const updatedStockAllocationData = itemsWithPrices.map(
                    (item: any) => ({
                      U_tl_bplid: data.U_tl_bplid,
                      U_tl_itemcode: item.U_tl_itemnum,
                      U_tl_itemname: item.ItemName, // Use the fetched item name
                      U_tl_qtyaloc: item.U_tl_qtyaloc,
                      U_tl_qtycon: item.U_tl_qtycon,
                      U_tl_qtyopen: item.U_tl_qtyopen,
                      U_tl_remark: item.U_tl_remark,
                      U_tl_uom: item.U_tl_uom,
                      ItemPrice: item.ItemPrice, // Use the fetched price
                    })
                  );

                  // Assuming nozzleData requires similar information as stockAllocationData
                  // Adjust any specific fields as necessary for nozzleData
                  const updatedNozzleData = itemsWithPrices.map(
                    (item: any) => ({
                      U_tl_nozzlecode: item.U_tl_pumpcode,
                      U_tl_itemcode: item.U_tl_itemnum,
                      U_tl_itemname: item.ItemName, // Use the fetched item name
                      U_tl_uom: item.U_tl_uom,
                      U_tl_nmeter: item.U_tl_nmeter,
                      U_tl_ometer: item.U_tl_upd_meter,
                      U_tl_cmeter: item.U_tl_cmeter,
                      U_tl_reg_meter: item.U_tl_reg_meter,
                      U_tl_cardallow: item.U_tl_cardallow,
                      U_tl_cashallow: item.U_tl_cashallow,
                      U_tl_ownallow: item.U_tl_ownallow,
                      U_tl_partallow: item.U_tl_partallow,
                      U_tl_pumpallow: item.U_tl_pumpallow,
                      U_tl_stockallow: item.U_tl_stockallow,
                      U_tl_totalallow: item.U_tl_totalallow,
                      ItemPrice: item.ItemPrice, // Use the fetched price
                    })
                  );

                  // Update your component state or pass this data as needed
                  handlerChangeObject({
                    U_tl_pump: e,
                    stockAllocationData: updatedStockAllocationData,
                    nozzleData: updatedNozzleData,
                  });
                }}
              />
            </div>
          </div>
          <div>
            <input
              hidden
              name="U_tl_arbusi"
              value={data?.U_tl_arbusi}
              onChange={(e) => {
                handlerChange("U_tl_arbusi", e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-5 py-1">
            <div className="col-span-2 text-gray-600 ">
              Customer <span className="text-red-500">*</span>
            </div>
            <div className="col-span-3 text-gray-900">
              <VendorByBranch
                branch={data?.U_tl_bplid}
                vtype="customer"
                onChange={(vendor) => handlerChange("vendor", vendor)}
                // onChange={(vendor) => handlerChangeObject({
                //   "vendor" : vendor,
                //   // "PriceList" : vendor.priceLists
                // })}
                key={data?.CardCode}
                // error={"CardCode" in data?.error}
                helpertext={data?.error?.CardCode}
                autoComplete="off"
                defaultValue={edit ? data.U_tl_cardcode : data?.CardCode}
                name="BPCode"
                disabled={edit}
                endAdornment={!edit}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Name
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                value={edit ? data.U_tl_cardname : data?.CardName}
                disabled
                name="BPName"
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Shift
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                value={data.Shift}
                onChange={(e) => {
                  handlerChange("Shift", e.target.value);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Pump Attendant <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <DispenserAutoComplete
                value={data?.PumpAttendant}
                isStatusActive
                branch={data?.U_tl_bplid ?? BPL}
                pumpType="Oil"
                onChange={(e) => {
                  handlerChange("PumpAttendant", e);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1"></div>
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Series
              </label>
            </div>
            <div className="col-span-3">
              <div className="grid grid-cols-2 gap-3">
                <MUISelect
                  items={filteredSeries ?? data.seriesList}
                  aliasvalue="Series"
                  aliaslabel="Name"
                  name="Series"
                  loading={data?.isLoadingSerie}
                  // value={edit ? data?.Series : filteredSeries[0]?.Series}
                  value={data?.Series}
                  disabled={edit}
                />
                <div className="-mt-1">
                  <MUITextField
                    size="small"
                    name="DocNum"
                    // value={
                    //   edit ? data?.DocNum : filteredSeries[0]?.NextNumber ?? ""
                    // }
                    value={data.DocNum}
                    disabled
                    placeholder="Document No"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Document Date
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                disabled={edit}
                value={data.U_tl_docdate}
                onChange={(e: any) => handlerChange("U_tl_docdate", e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
