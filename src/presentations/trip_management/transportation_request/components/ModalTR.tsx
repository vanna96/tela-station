import request, { url } from "@/utilies/request";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Backdrop, Box, Button, CircularProgress, Modal } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import { MRT_RowSelectionState } from "material-react-table";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import DataTableS from "./DataTableS";
import { TRSourceDocument } from "./Document";
import shortid from "shortid";
import FormMessageModal from "@/components/modal/FormMessageModal";
import { UseTRModalListHook } from "../hook/UseTRModalListHook";
import { Controller, useForm } from "react-hook-form";
import { conditionString } from "@/lib/utils";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  bgcolor: "background.paper",
  p: 4,
  paddingBottom: 1,
  paddingtop: 1,
};
let dialog = React.createRef<FormMessageModal>();

export default function TRModal(props: any) {
  const [sortBy, setSortBy] = React.useState("");
  const [openLoading, setOpenLoading] = React.useState(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data,
    loading,
    refetchData,
    setFilter,
    setSort,
    totalRecords,
    state,
  } = UseTRModalListHook(pagination);
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "id__",
        header: "No", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        Cell: (cell: any, index: number) => {
          return cell.row.original["id__"] ?? "N/A";
        },
      },
      {
        accessorKey: "DocNum",
        header: "Document Number", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.DocNum ?? "N/A";
        },
      },
      {
        accessorKey: "U_Type",
        header: "Type", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_Type ?? "N/A";
        },
      },

      {
        accessorKey: "BPLId",
        header: "Branch", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 100,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return cell.row.original.BPLName;
        },
      },
      {
        accessorKey: "CardCode",
        header: "Customer Code",
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.CardCode ?? "N/A";
        },
      },
      {
        accessorKey: "CardName",
        header: "Customer Name",
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.CardName ?? "N/A";
        },
      },
      {
        accessorKey: "DocDate",
        header: "Document Date",
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.DocDate ?? "N/A";
        },
      },
      {
        accessorKey: "id__",
        header: "No. Item",
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any, index: number) => {
          return cell.row.original["id__"] ?? "N/A";
        },
      },
      {
        accessorKey: "Quantity",
        header: "Total Quantity",
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return (
            (cell.row.original["TotalQuantity"] ?? "N/A").toString() + ".0"
          );
        },
      },
    ],
    [data]
  );

  const handleClose = () => {
    setRowSelection({});
    setOpenLoading(false);
    props?.setOpen(false);
  };
  const onSelectData = React.useCallback(async () => {
    setOpenLoading(true);
    const payload: any[] = [];
    for (const [key, value] of Object.entries(rowSelection)) {
      if (!value) continue;
      payload.push({
        Type: key.split("_")?.at(1),
        DocEntry: key.split("_")?.at(-1),
      });
    }

    await request("POST", "/script/test/get_trans_request_source", {
      Documents: payload,
    })
      .then((res: any) => {
        const selected: TRSourceDocument[] = res?.data?.value?.map(
          (e: TRSourceDocument) => {
            return {
              U_SourceDocEntry: e.U_SourceDocEntry,
              U_DocNum: e.U_DocNum,
              U_Type: e.U_Type,
              U_CardCode: e.U_CardCode,
              U_CardName: e.U_CardName,
              U_DeliveryDate: e.U_DeliveryDate,
              U_ShipToCode: e.U_ShipToCode,
              U_ItemCode: e.U_ItemCode,
              U_ShipToAddress: e.U_ShipToAddress,
              U_Quantity: e.U_Quantity,
              U_UomCode: e.U_UomCode,
              U_UomAbsEntry: e.U_UomAbsEntry,
            };
          }
        );
        const document = props?.document?.map((e: any) => ({
          ...e,
          id: undefined,
        }));
        props?.setValue("TL_TR_ROWCollection", [...document, ...selected]);
        setRowSelection({});
        setOpenLoading(false);
        props?.setOpen(false);
      })
      ?.catch((err) => {
        setOpenLoading(false);
        setRowSelection({});
        props?.setOpen(false);
        dialog.current?.error(err.message);
      });
  }, [rowSelection]);

  return (
    <>
      <FormMessageModal ref={dialog} />
      <Modal
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} borderRadius={3}>
          <div
            className={`w-full h-full ${
              openLoading ? "block" : "hidden"
            } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
          >
            <CircularProgress color="success" />{" "}
          </div>
          <InventoryTransferFilter />
          <DataTableS
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            columns={columns}
            data={data}
            handlerRefresh={refetchData}
            handlerSearch={() => {}}
            handlerSortby={setSort}
            count={totalRecords}
            loading={loading}
            pagination={pagination}
            paginationChange={setPagination}
          />
          {/* </div> */}
          <div className="w-full flex justify-end items-center gap-4 h-[50px] mt-3">
            {" "}
            <Button
              size="small"
              sx={{ height: "25px" }}
              // variant="outlined"
              style={{
                background: "white",
                // border: "1px solid red",
              }}
              disableElevation
              onClick={() => props?.setOpen(false)}
            >
              <span className="px-3 text-[11px] py-1 text-red-500">Cancel</span>
            </Button>
            <Button
              onClick={onSelectData}
              sx={{ height: "25px" }}
              className="bg-white"
              size="small"
              variant="contained"
              disableElevation
            >
              <span className="px-4 text-[11px] py-4 text-white ">+ Add</span>
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
export interface FilterProps {
  DocNum_$eq_number: undefined | string;
  U_Type_$eq: undefined | string;
  BPLId_$eq_number: undefined | number;
  DocDate_$eq: undefined | string;
  DocDueDate_$eq: undefined | string
}

const defaultValueFilter: FilterProps = {
  DocNum_$eq_number: undefined,
  U_Type_$eq: undefined,
  BPLId_$eq_number: undefined,
  DocDate_$eq: undefined,
  DocDueDate_$eq: undefined
};

export const InventoryTransferFilter = ({
  onFilter,
}: {
  onFilter?: (values: (string | undefined)[], query: string) => any;
}) => {
  const { handleSubmit, setValue, control, watch } = useForm({
    defaultValues: defaultValueFilter,
  });
  function onSubmitModal(data: any) {
    const queryString: (string | undefined)[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;
      queryString.push("and");
      queryString.push(conditionString(key, value as any));
    }
    queryString.splice(0, 1);
    const query = queryString.join(" ");

    if (onFilter) onFilter(queryString, query);
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmitModal)}
      className="grid grid-cols-12 gap-3 mb-4 mx-1 rounded-md bg-white"
    >
      <div className="col-span-10">
        <div className="grid grid-cols-12  space-x-4">
          <div className="col-span-2 2xl:col-span-3">
            <Controller
              name="DocNum_$eq_number"
              control={control}
              render={({ field }) => {
                return (
                  <MUITextField
                    label="Document Number"
                    placeholder="Document Number"
                    className="bg-white"
                    onBlur={(e) =>
                      setValue("DocNum_$eq_number", e.target.value)
                    }
                  />
                );
              }}
            />
          </div>

          <div className="col-span-3 2xl:col-span-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 mt-0 text-[14px]">
                Document Type
              </label>
              <div className="">
                <Controller
                  name="U_Type_$eq"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        items={[
                          { value: "All", label: "All" },
                          { value: "SO", label: "Sale Order" },
                          { value: "ITR", label: "Inventory Transfer Request" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_Type_$eq", e?.target?.value);
                        }}
                        value={field?.value || null}
                        aliasvalue="value"
                        aliaslabel="label"
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 2xl:col-span-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 mt-0 text-[14px]">
                Branch
              </label>
              <div className="">
                <Controller
                  name="BPLId_$eq_number"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BranchAssignmentAuto
                        onChange={(e: any) => {
                          setValue("BPLId_$eq_number", e?.target?.value);
                        }}
                        value={field.value}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 2xl:col-span-3 -mt-1">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 mt-0 text-[14px]">
                From Date
              </label>
              <div className="">
                <Controller
                  name="DocDate_$eq"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        onChange={(e: any) => {
                          setValue("DocDate_$eq", e);
                        }}
                        value={field.value}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 2xl:col-span-3 -mt-1">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 mt-0 text-[14px]">
                To Date
              </label>
              <div className="">
                <Controller
                  name="DocDueDate_$eq"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        onChange={(e: any) => {
                          setValue("DocDueDate_$eq", e);
                        }}
                        value={field.value}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 2xl:col-span-3"></div>
        </div>
      </div>
      <div className="col-span-2 mt-2">
        <div className="flex justify-end items-center align-center space-x-2 mt-4">
          <div className="">
            <Button variant="contained" size="small" type="submit">
              {" "}
              Go{" "}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
