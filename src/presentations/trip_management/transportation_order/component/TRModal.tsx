import request, { url } from "@/utilies/request";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import MUITextField from "@/components/input/MUITextField";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import { MRT_RowSelectionState } from "material-react-table";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import DataTable from "./DataTabaleO";
import { Controller, useForm } from "react-hook-form";
import { conditionString, queryOptionParser, displayTextDate } from '@/lib/utils';
import { QueryOptionAPI } from "@/lib/filter_type";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "90vh",
  bgcolor: "background.paper",
  p: 4,
};


interface TransportationOrderModalProps {
  onSelectItems: (items: any[]) => any,
}

interface TransportationOrderState {
  open: boolean,
};

export class TransportationOrderModal extends React.Component<TransportationOrderModalProps, TransportationOrderState> {
  state = { open: false } as TransportationOrderState;

  onClose() {
    this.setState({ open: false });
  }

  onOpen() {
    this.setState({ open: true });
  }

  onSelectChangeItems(items: any[]) {
    this.props.onSelectItems(items)
    this.setState({ open: false })

  }

  render() {
    return <TRModal open={this.state.open} onClose={() => this.onClose()} onSelectItems={(items: any) => this.onSelectChangeItems(items)} />
  }
}


interface FilterProps {
  DocNum_$eq_number: undefined | string;
  U_Type_$eq: undefined | string;
  BPLId_$eq_number: undefined | string;
  DocDate_$ge: undefined | string;
  DocDate_$le: undefined | string;
}

const defaultValueFilter: FilterProps = {
  DocNum_$eq_number: undefined,
  U_Type_$eq: undefined,
  BPLId_$eq_number: undefined,
  DocDate_$ge: undefined,
  DocDate_$le: undefined,
};

export const TransportionOrderFilterModal = ({ onFilter }: { onFilter?: (query: string) => any }) => {
  const { handleSubmit, setValue, control, watch } = useForm({
    defaultValues: defaultValueFilter,
  });

  function onSubmit(data: any) {
    const queryString: (string | undefined)[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;

      queryString.push("and");
      queryString.push(conditionString(key, value as any));
    }

    queryString.splice(0, 1);
    const query = queryString.join(" ");

    if (onFilter) onFilter(query);
  }

  return <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
    <div className="col-span-10">
      <div className="grid grid-cols-12  space-x-4">
        <div className="col-span-2 2xl:col-span-3">
          <Controller
            name="DocNum_$eq_number"
            control={control}
            render={({ field }) => <MUITextField type="string" label="Document Number" className="bg-white" autoComplete="off" onBlur={(e) => setValue('DocNum_$eq_number', e.target.value)} />}
          />
        </div>
        <div className="col-span-2 2xl:col-span-3">
          <div className="">
            <label htmlFor="Code" className="text-gray-500 text-[14.1px] mb-[2px] inline-block">Document Type </label>
          </div>
          <Controller
            name="U_Type_$eq"
            control={control}
            render={({ field }) =>
              <MUISelect
                value={field.value}
                items={[
                  { value: "All", label: "All" },
                  { value: "TR", label: "Transportation Request" },
                  { value: "ITR", label: "Inventory Transfer Request" },
                ]}
                aliasvalue="value"
                aliaslabel="label"
                onChange={(e) => setValue('U_Type_$eq', (e?.target?.value) as string)}
              />}
          />

        </div>
        <div className="col-span-2 2xl:col-span-3">
          <div className="">
            <label
              htmlFor="Code"
              className="text-gray-500 text-[14.1px] mb-[2px] inline-block"
            >
              Branch
            </label>
          </div>
          <Controller
            name="BPLId_$eq_number"
            control={control}
            render={({ field }) => <BranchAssignmentAuto value={field.value} onChange={(e) => setValue('BPLId_$eq_number', e?.BPLID)} />}
          />
        </div>

        <div className="col-span-2 -mt-1 2xl:col-span-3">
          <div className="">
            <label
              htmlFor="Code"
              className="text-gray-500 text-[14.1px] inline-block"
            >
              From Date
            </label>
          </div>
          <Controller
            name="DocDate_$ge"
            control={control}
            render={({ field }) =>
              <MUIDatePicker
                value={field.value}
                onChange={(e) => {
                  if (e !== null) {
                    const val =
                      e.toLowerCase() === "Invalid Date".toLocaleLowerCase()
                        ? ""
                        : e;
                    setValue('DocDate_$ge', val)
                  }
                }}
              />}
          />
        </div>

        <div className="col-span-2 -mt-1 2xl:col-span-3">
          <div className="">
            <label
              htmlFor="Code"
              className="text-gray-500 text-[14.1px] inline-block"
            >
              To Date
            </label>
          </div>
          <Controller
            name="DocDate_$le"
            control={control}
            render={({ field }) =>
              <MUIDatePicker
                value={field.value}
                onChange={(e) => {
                  if (e !== null) {
                    const val =
                      e.toLowerCase() === "Invalid Date".toLocaleLowerCase()
                        ? ""
                        : e;
                    setValue('DocDate_$le', val)
                  }
                }}
              />}
          />
        </div>

        <div className="col-span-2 2xl:col-span-3"></div>
        {/*  */}

        <div className="col-span-2 2xl:col-span-3"></div>
      </div>
    </div>
    <div className="col-span-2 mt-[0.3rem]">
      <div className="flex justify-end items-center align-center space-x-2 mt-4">
        <div className="">
          <Button
            variant="contained"
            size="small"
            type="submit"
          >
            <span className="text-xs p-1">Search</span>
          </Button>
        </div>
      </div>
    </div>
  </form>;
}


const defaultQuery: QueryOptionAPI = {
  skip: 0,
  top: 10,
  orderby: "U_SourceDocEntry desc",
} as const;

const initialState = { ...defaultQuery };

function reducer(state: QueryOptionAPI, action: ActionQueryParam) {
  switch (action.type) {
    case "skip":
      return { ...state, skip: action.value } as QueryOptionAPI;
    case "orderby":
      return { ...state, orderby: action.value } as QueryOptionAPI;
    case "filter":
      return { ...state, filter: action.value } as QueryOptionAPI;
    case "top":
      return { ...state, top: action.value } as QueryOptionAPI;
    case "all":
      return { ...(action.value as QueryOptionAPI) } as QueryOptionAPI;
    default:
      return state;
  }
}

type ActionQueryParam = {
  type: keyof QueryOptionAPI | "all";
  value?: string | number | QueryOptionAPI;
};

export default function TRModal(props: { open: boolean, onClose: () => void, onSelectItems: (items: any) => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const filters = useMemo(() => {
    return {
      ...state,
      skip: Number(pagination?.pageIndex) * Number(pagination?.pageSize),
      top: pagination?.pageSize ?? 10,
    } as QueryOptionAPI;
  }, [pagination, state]);

  const dataQuery = useQuery({
    queryKey: ['mdoc_' + filters.skip, filters],
    queryFn: () => request("GET", `/sml.svc/TLTO_MDOCS?${queryOptionParser(filters)}`),
    refetchOnWindowFocus: false,
  });
  const countQuery = useQuery({
    queryKey: ['mdoc_count_' + filters.skip, filters],
    queryFn: () =>
      request("GET", `/sml.svc/TLTO_MDOCS/$count?${queryOptionParser(filters)}`),
    refetchOnWindowFocus: false,
  });

  const data: any[] = React.useMemo(
    () => (dataQuery?.data as any)?.data?.value ?? [],
    [dataQuery]
  );
  const totalRecords: number = React.useMemo(
    () => (countQuery?.data as any)?.data ?? 0,
    [countQuery]
  );

  const refetchData = async () => {
    dispatch({ type: "all", value: defaultQuery });
    dataQuery.refetch();
    countQuery.refetch();
  };

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
      // {
      //   accessorKey: "CardCode",
      //   header: "Customer Code",
      //   size: 60,
      //   visible: true,
      //   type: "string",
      //   Cell: (cell: any) => {
      //     return cell.row.original.CardCode ?? "N/A";
      //   },
      // },
      // {
      //   accessorKey: "CardName",
      //   header: "Customer Name",
      //   size: 60,
      //   visible: true,
      //   type: "string",
      //   Cell: (cell: any) => {
      //     return cell.row.original.CardName ?? "N/A";
      //   },
      // },
      {
        accessorKey: "DocDate",
        header: "Document Date",
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => displayTextDate(cell.row.original.DocDate),
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

  const onSelectData = React.useCallback(async () => {
    const keys = Object.keys(rowSelection);
    if (keys.length === 0) {
      props.onClose();
      return;
    }

    var documents: { U_Type: string, U_SourceDocEntry: number | string }[] = [];
    for (const value of keys) {
      const row = value.split('/');
      documents.push({ U_Type: row?.at(1) ?? '', U_SourceDocEntry: Number(row?.at(2)) ?? '' })
    }

    setIsLoading(true)
    try {
      const response: any = await request("POST", "/script/test/get_trans_order_source", { Documents: documents });
      props.onSelectItems(response?.data?.value ?? [])
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      throw error;
    }
  }, [rowSelection]);

  useEffect(() => {
    dispatch({ type: "all", value: defaultQuery });
    setRowSelection({});
    dataQuery.refetch();
    countQuery.refetch();
  }, [props.open])

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >


        <Box sx={style} borderRadius={3}>
          <div
            className={`w-full h-full ${isLoading ? "block" : "hidden"
              } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
          >
            <CircularProgress color="success" />{" "}
          </div>
          <div className="h-full w-full flex flex-col ">
            <div
              className={`w-full h-full  ${false ? "block" : "hidden"
                } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
            >
              <CircularProgress color="success" />{" "}
            </div>
            <TransportionOrderFilterModal onFilter={(value) => dispatch({ type: "filter", value })} />

            <div className="grow whitespace-nowrap overflow-auto">
              <DataTable
                handlerRefresh={refetchData}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                columns={columns}
                data={data ?? []}
                count={totalRecords}
                loading={dataQuery.isLoading || countQuery.isLoading}
                pagination={pagination}
                paginationChange={setPagination}
                title="Document"
              />
            </div>
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
                onClick={() => props.onClose()}
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
                <span className="px-4 text-[11px] py-4 text-white ">Add</span>
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
