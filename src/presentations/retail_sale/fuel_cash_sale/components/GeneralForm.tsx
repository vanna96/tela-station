import React, { useState } from "react";
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
const fetchItemNameandPrice = async (item: string) => {
  const res = await request(
    "GET",
    `Items/'${item}?$select=ItemName,ItemPrices`
  );
  return res.data;
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
    data.seriesList.find((series: any) => series.BPLID === BPL)?.Series || "";

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }
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
                onChange={async (e: any) => {
                  const dispenserData = await fetchDispenserData(e);
                  // console.log(dispenserData);

                  // selectItems = selectItems.map((e: any) => {
                  //   const defaultPrice = e?.ItemPrices?.find(
                  //     (row: any) => row?.PriceList === globalPriceListNum
                  //   )?.Price;

                  //   return {
                  //     ...e,
                  //     defaultPrice: defaultPrice, // Assuming you want to add the defaultPrice to the selectItems
                  //   };
                  // });
                  handlerChangeObject({
                    U_tl_pump: e,

                    stockAllocationData:
                      dispenserData?.TL_DISPENSER_LINESCollection?.filter(
                        (e: any) =>
                          e.U_tl_status === "Initialized" ||
                          e.U_tl_status === "Active"
                      )?.map((item: any) => ({
                        U_tl_bplid: data.U_tl_bplid,
                        U_tl_itemnum: item.U_tl_itemnum,
                        U_tl_itemdesc: item.U_tl_itemname,
                        U_tl_qtyaloc: item.U_tl_qtyaloc,
                        U_tl_qtycon: item.U_tl_qtycon,
                        U_tl_qtyopen: item.U_tl_qtyopen,
                        U_tl_remark: item.U_tl_remark,
                        U_tl_uom: item.U_tl_uom,
                        // ItemPrices: item.ItemPrices,
                        ItemPrices: new itemRepository().find(
                          `${item.U_tl_itemnum}`
                        ),
                      })),
                    nozzleData:
                      dispenserData?.TL_DISPENSER_LINESCollection?.filter(
                        (e: any) =>
                          e.U_tl_status === "Initialized" ||
                          e.U_tl_status === "Active"
                      )?.map((item: any) => ({
                        U_tl_itemnum: item.U_tl_itemnum,
                      })),
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
                key={data?.CardCode}
                error={"CardCode" in data?.error}
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
                  value={edit ? data?.Series : filteredSeries[0]?.Series}
                  disabled={edit}
                />
                <div className="-mt-1">
                  <MUITextField
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
