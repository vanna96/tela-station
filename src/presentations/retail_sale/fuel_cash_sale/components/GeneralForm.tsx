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
import { TextField } from "@mui/material";
import MUIRightTextField from "@/components/input/MUIRightTextField";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  handlerChangeObject: (obj: any) => void;
}

const fetchDispenserData = async (pump: string) => {
  const res = await request(
    "GET",
    `TL_Dispenser('${pump}')?$select=Code,Name,U_tl_type,U_tl_status,U_tl_bplid,U_tl_whs,TL_DISPENSER_LINESCollection`
  );
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
  const filteredSeries = data?.SerieLists?.filter(
    (series: any) =>
      series?.BPLID === BPL && parseInt(series.PeriodIndicator) === year
  );

  const seriesSO =
    data.SerieLists.find((series: any) => series.BPLID === BPL)?.Series || "";

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }
  if (data) {
    data.Series = seriesSO;
  }

  const [isDispenserLoading, setIsDispenserLoading] = useState(false);
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
                Branch <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <BranchAutoComplete
                BPdata={userData?.UserBranchAssignment}
                onChange={(e) => handlerChange("U_tl_bplid", e)}
                value={BPL || 1}
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
                loading={isDispenserLoading}
                onChange={async (e: any) => {
                  setIsDispenserLoading(true);
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

                      return {
                        ...line,
                        ItemName: itemDetails?.ItemName, // Add the fetched item name
                        ItemPrice: price, // Add the fetched price
                      };
                    });

                  const itemsWithPrices = await Promise.all(
                    itemsWithPricesPromises
                  );

                  const warehouseCode = dispenserData?.U_tl_whs;

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
                      U_tl_bplid: data.U_tl_bplid,
                      U_tl_whs: warehouseCode,
                      U_tl_bincode: item.U_tl_bincode,
                    })
                  );
                  const updatedStockAllocationData = itemsWithPrices.map(
                    (item: any) => ({
                      U_tl_bplid: data.U_tl_bplid,
                      U_tl_whs: warehouseCode,
                      U_tl_bincode: parseInt(item.U_tl_bincode),
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

                  const updatedCardCountData = updatedNozzleData
                    ?.filter((e: any) => e?.U_tl_nmeter > 0)
                    .map((item: any) => ({
                      U_tl_itemcode: item.U_tl_itemcode,
                      U_tl_1l: item?.U_tl_1l,
                      U_tl_2l: item?.U_tl_2l,
                      U_tl_5l: item?.U_tl_5l,
                      U_tl_10l: item?.U_tl_10l,
                      U_tl_20l: item?.U_tl_20l,
                      U_tl_50l: item?.U_tl_50l,
                      U_tl_total: item?.U_tl_total,
                    }));

                  // Update your component state or pass this data as needed
                  handlerChangeObject({
                    U_tl_pump: e,
                    stockAllocationData: updatedStockAllocationData,
                    nozzleData: updatedNozzleData,
                    cardCountData: updatedCardCountData,
                  });
                  setIsDispenserLoading(false);
                }}
              />
            </div>
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
                key={data?.CardCode}
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
                value={data?.U_tl_attend}
                isStatusActive
                branch={parseInt(data?.U_tl_bplid) ?? BPL}
                pumpType="Oil"
                onChange={(e) => {
                  handlerChange("U_tl_attend", e);
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
                Series <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <div className="grid grid-cols-2 gap-3">
                <MUISelect
                  items={filteredSeries ?? data.SerieLists}
                  aliasvalue="Series"
                  aliaslabel="Name"
                  name="Series"
                  loading={data?.isLoadingSerie}
                  value={filteredSeries[0]?.Series}
                  disabled={edit}
                />
                <div className="-mt-1">
                  <MUIRightTextField
                    size="small"
                    name="DocNum"
                    value={
                      edit ? data?.DocNum : filteredSeries[0]?.NextNumber ?? ""
                    }
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
                Document Date <span className="text-red-500">*</span>
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
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Status
              </label>
            </div>
            <div className="col-span-3">
              <MUISelect
                items={[
                  { label: "Open", value: "1" },
                  { label: "Closed", value: "0" },
                ]}
                name="U_tl_status"
                loading={data?.isLoadingSerie}
                value={data?.U_tl_status}
                disabled={edit}
                onChange={(e: any) =>
                  handlerChange("U_tl_status", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Own Usage Remark
              </label>
            </div>
            <div className="col-span-3">
              <TextField
                multiline
                className="w-full"
                rows={2}
                value={data.Remark}
                onChange={(e: any) => handlerChange("Remark", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
