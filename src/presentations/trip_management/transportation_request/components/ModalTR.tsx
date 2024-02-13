import request, { url } from "@/utilies/request";
import React, { useState } from "react";
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
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "background.paper",
  p: 4,
};

export default function TRModal(props: any) {
  const [searchValues, setSearchValues] = React.useState({
    DocumentNumber: "",
    Type: "",
    Status: "",
    Branch: "",
    From: "",
    To: "",
  });
  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");
  const [openLoading, setOpenLoading] = React.useState(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Count: any = useQuery({
    queryKey: [`TL_TR_DOCS`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/sml.svc/TLTR_MDOCS/$count?${filter ? `$filter=${filter}` : ""}`
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
  });

  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "TL_TR_DOCS",
      `${pagination.pageIndex * pagination.pageSize}_${
        filter !== "" ? "f" : ""
      }`,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const Url = `${url}/sml.svc/TLTR_MDOCS?$top=${
        pagination.pageSize
      }&$skip=${pagination.pageIndex * pagination.pageSize}${
        filter ? `&$filter=${filter}` : filter
      }${sortBy !== "" ? "&$orderby=" + sortBy : ""}`;

      const response: any = await request("GET", `${Url}`)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
  });

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
  const handlerRefresh = React.useCallback(() => {
    setRowSelection({});
    setFilter("");
    setSortBy("");
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  }, []);

  const handlerSortby = (value: any) => {
    setSortBy(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    console.log(value);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  let queryFilters = "";
  const handlerSearch = (value: string) => {
    if (searchValues.DocumentNumber) {
      queryFilters += queryFilters
        ? ` and (contains(DocNum, ${searchValues.DocumentNumber}))`
        : `(contains(DocNum, ${searchValues.DocumentNumber}))`;
    }
    if (searchValues.Type) {
      searchValues.Type === "All"
        ? (queryFilters += queryFilters ? "" : "")
        : (queryFilters += queryFilters
            ? ` and U_Type eq '${searchValues.Type}'`
            : `U_Type eq '${searchValues.Type}'`);
    }
    if (searchValues.Branch) {
      queryFilters += queryFilters
        ? ` and (contains(BPLId, ${searchValues.Branch}))`
        : `(contains(BPLId, ${searchValues.Branch}))`;
    }
    if (searchValues.From) {
      queryFilters += queryFilters
        ? ` and DocDate ge '${searchValues.From}'`
        : `DocDate ge '${searchValues.From}'`;
    }

    if (searchValues.To) {
      queryFilters += queryFilters
        ? ` and DocDueDate le '${searchValues.To}'`
        : `DocDueDate le '${searchValues.To}'`;
    }
    let query = queryFilters;

    if (value) {
      query = queryFilters + `and ${value}`;
    }
    setFilter(query);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };
  const handleClose = () => {
    setRowSelection({});

    props?.setOpen(false);
  };
  const onSelectData = React.useCallback(async () => {
    setOpenLoading(true);
    let ids = [];
    for (const [key, value] of Object.entries(rowSelection)) {
      if (!value) continue;

      const docNum = key.split("_")?.at(-1);
      ids.push(`U_DocNum eq ${docNum}`);
    }
    await request(
      "get",
      "/sml.svc/TLTR_LINEDOCS?" + `$filter=${ids.join(" or ")}`
    ).then((res: any) => {
      const selected: TRSourceDocument[] = res?.data?.value?.map(
        (e: TRSourceDocument) => {
          return {
            U_SourceDocEntry: e.U_SourceDocEntry,
            // SourceId: e,
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
        id:undefined
      }))
      props?.setValue("TL_TR_ROWCollection", [...document, ...selected]);
      setRowSelection({});
      setOpenLoading(false);
      props?.setOpen(false);
    });
  }, [rowSelection]);

  const lists = React.useMemo(() => data, [data]);

  return (
    <>
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
          {/* <div className="w-[80vw] h-[80vh] px-6 py-2 flex flex-col gap-1 relative bg-white"> */}
          <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
            <div className="col-span-10">
              <div className="grid grid-cols-12  space-x-4">
                <div className="col-span-2 2xl:col-span-3">
                  <MUITextField
                    type="string"
                    label="Document Number"
                    className="bg-white"
                    autoComplete="off"
                    value={searchValues.DocumentNumber}
                    onChange={(e) =>
                      setSearchValues({
                        ...searchValues,
                        DocumentNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2 2xl:col-span-3">
                  <div className="">
                    <label
                      htmlFor="Code"
                      className="text-gray-500 text-[14.1px] mb-[2px] inline-block"
                    >
                      Document Type
                    </label>
                  </div>

                  <MUISelect
                    items={[
                      { value: "All", label: "All" },
                      { value: "SO", label: "Sale Order" },
                      { value: "ITR", label: "Inventory Transfer Request" },
                    ]}
                    onChange={(e: any) => {
                      setSearchValues({
                        ...searchValues,
                        Type: e.target.value,
                      });
                    }}
                    value={
                      // searchValues.active === null ? "tYES" : searchValues.active
                      searchValues.Type
                    }
                    aliasvalue="value"
                    aliaslabel="label"
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
                  <BranchAssignmentAuto
                    onChange={(e) => {
                      console.log(e);
                      if (e !== null) {
                        setSearchValues({
                          ...searchValues,
                          Branch: e.BPLID,
                        });
                      } else {
                        setSearchValues({
                          ...searchValues,
                          Branch: "",
                        });
                      }
                    }}
                    value={searchValues.Branch}
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
                  <MUIDatePicker
                    onChange={(e) => {
                      if (e !== null) {
                        const val =
                          e.toLowerCase() === "Invalid Date".toLocaleLowerCase()
                            ? ""
                            : e;
                        setSearchValues({
                          ...searchValues,
                          From: val,
                        });
                      } else {
                        setSearchValues({
                          ...searchValues,
                          From: "",
                        });
                      }
                    }}
                    value={searchValues.From}
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
                  <MUIDatePicker
                    onChange={(e) => {
                      if (e !== null) {
                        const val =
                          e.toLowerCase() === "Invalid Date".toLocaleLowerCase()
                            ? ""
                            : e;
                        setSearchValues({
                          ...searchValues,
                          To: val,
                        });
                      } else {
                        setSearchValues({
                          ...searchValues,
                          To: "",
                        });
                      }
                    }}
                    value={searchValues.To}
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
                    onClick={() => handlerSearch("")}
                  >
                    <span className="text-xs p-1">Search</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DataTableS
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            columns={columns}
            data={lists ?? []}
            handlerRefresh={handlerRefresh}
            handlerSearch={handlerSearch}
            handlerSortby={handlerSortby}
            count={Count?.data || 0}
            loading={isLoading || isFetching}
            pagination={pagination}
            paginationChange={setPagination}
            title="Document"
            filter={filter}
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
