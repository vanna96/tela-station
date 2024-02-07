import request, { url } from "@/utilies/request";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Box, Button, Modal } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import TRTable from "./TRTable";
import { MRT_RowSelectionState } from "material-react-table";

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
    active: "tYES",
  });
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });
  // console.log(branchAss);

  const route = useNavigate();

  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Count: any = useQuery({
    queryKey: [`TL_TR_DOCS`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/sml.svc/TL_TR_DOCS/$count?${filter ? `$filter=${filter}` : ""}`
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
      const Url = `${url}/sml.svc/TL_TR_DOCS?$top=${
        pagination.pageSize
      }&$skip=${pagination.pageIndex * pagination.pageSize}${
        filter ? ` and ${filter}` : filter
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
          console.log(sortBy);
          // return (
          //   <span>
          //     {sortBy.includes("asc") || sortBy === ""
          //       ? cell?.row?.index + 1
          //       : Count?.data - cell?.row?.index}
          //     {/* {cell?.row?.index + 1} */}
          //   </span>
          // );
          return cell.row.original['id__'] ?? "N/A";
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
        accessorKey: "Type",
        header: "Type", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.Type ?? "N/A";
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
        Cell: (cell: any) => {
          return 1;
        },
      },
      {
        accessorKey: "Quantity",
        header: "Total Quantity",
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original["Quantity"] ?? "N/A";
        },
      },
    ],
    [data]
  );
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  console.log(data?.length);

  const handlerRefresh = React.useCallback(() => {
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
        ? ` and (contains(DocumentNo, '${searchValues.DocumentNumber}'))`
        : `(contains(DocumentNo, '${searchValues.DocumentNumber}'))`;
    }

    if (searchValues.active) {
      searchValues.active === "All"
        ? (queryFilters += queryFilters ? "" : "")
        : (queryFilters += queryFilters
            ? ` and Active eq '${searchValues.active}'`
            : `Active eq '${searchValues.active}'`);
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
    props?.setOpen(false);
  };
  const onSelectData = React.useCallback(async () => {
    let ids = [];
    for (const [key, value] of Object.entries(rowSelection)) {
      if (!value) continue;
      const extractedKey = key.split('_')[1];
      ids.push(`DocNum eq ${extractedKey}`);
    }
    console.log(ids.join(" or "));
    const response = await request(
      "get",
      "/sml.svc/TL_TR_DOCS?" + `$filter=${ids.join(" or ")}`
    );

    console.log(response);
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
                      className="text-gray-500 text-[14.1px] mb-[0.5px] inline-block"
                    >
                      Document Type
                    </label>
                  </div>

                  <MUISelect
                    items={[
                      { value: "All", label: "All" },
                      { value: "SO", label: "Sale Order" },
                      { value: "tNO", label: "Inactive" },
                    ]}
                    onChange={(e: any) => {
                      setSearchValues({
                        ...searchValues,
                        active: e.target.value,
                      });
                    }}
                    value={
                      // searchValues.active === null ? "tYES" : searchValues.active
                      searchValues.active
                    }
                    aliasvalue="value"
                    aliaslabel="label"
                  />
                </div>
                <div className="col-span-2 2xl:col-span-3">
                  <MUITextField
                    type="string"
                    label="Branch"
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
                  <MUITextField
                    type="string"
                    label="From Date"
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
                  <MUITextField
                    type="string"
                    label="To Date"
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
                      className="text-gray-500 text-[14.1px] mb-[0.5px] inline-block"
                    >
                      Status
                    </label>
                  </div>

                  <MUISelect
                    items={[
                      { value: "All", label: "All" },
                      { value: "tYES", label: "Initiated" },
                      { value: "tNO", label: "Inactive" },
                    ]}
                    onChange={(e: any) => {
                      setSearchValues({
                        ...searchValues,
                        active: e.target.value,
                      });
                    }}
                    value={
                      // searchValues.active === null ? "tYES" : searchValues.active
                      searchValues.active
                    }
                    aliasvalue="value"
                    aliaslabel="label"
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
          <TRTable
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
