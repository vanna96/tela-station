import FormCard from "@/components/card/FormCard";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";
import { getShippingAddress } from "@/models/BusinessParter";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { TextField } from "@mui/material";

export interface ILogisticFormProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function LogisticForm({
  data,
  handlerChange,
  edit,
  ref,
}: ILogisticFormProps) {
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-screen">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ship-From Address
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  className="bg-gray-100"
                  size="small"
                  fullWidth
                  multiline
                  value={
                    new BranchBPLRepository().find(
                      data?.BPL_IDAssignedToInvoice || 1
                    )?.Address ?? "N/A"
                  }
                  InputProps={{ readOnly: true }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Attention Terminal <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <WarehouseAttendTo
                  U_tl_attn_ter={true}
                  value={data.U_tl_attn_ter}
                  onChange={(e) => handlerChange("U_tl_attn_ter", e)}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ship-To Address
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  value={data?.ShipToCode}
                  aliaslabel="addressName"
                  aliasvalue="addressName"
                  items={// edit
                  //   ? data.vendor?.bpAddress?.filter(
                  //       ({ addressType }: any) => addressType === "bo_ShipTo"
                  //     )
                  //   : data?.BPAddresses?.filter(
                  //       ({ addressType }: any) => addressType === "bo_ShipTo"
                  //     )
                  data.vendor?.bpAddress?.filter(
                    ({ addressType }: any) => addressType === "bo_ShipTo"
                  )}
                  onChange={(e) => handlerChange("ShipToCode", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Shipping Address
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  className="bg-gray-100"
                  size="small"
                  fullWidth
                  multiline
                  value={
                    !edit
                      ? getShippingAddress(
                          data?.ShipToCode,

                          data?.BPAddresses?.filter(
                            ({ addressType }: any) =>
                              addressType === "bo_ShipTo"
                          )
                        )
                      : getShippingAddress(
                          data?.ShipToCode,
                          data?.vendor?.bpAddress?.filter(
                            ({ addressType }: any) =>
                              addressType === "bo_ShipTo"
                          )
                        )
                  }
                  InputProps={{ readOnly: true }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
